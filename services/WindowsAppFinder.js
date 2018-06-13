/** Powershell Commands */
/** Get list of installed apps */
// # Get-StartApps
/** will return name and appId of the app */

/** Run command using appId */
// # explorer.exe shell:"appsFolder\<appId>"

const spawn = require('child_process').spawnSync;

class Application {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }

    get Id() {
        return this._id;
    }

    get Name() {
        return this._name;
    }
}

class WindowsAppFinder {
    constructor() {
        this._POWERSHELL = "powershell.exe";
        this._EXPLORER = "explorer.exe";
        this._FETCH_APP_CMD = "Get-StartApps";
        this._RUN_APP = "shell:\"appsFolder\\";
        this.regex = /apps:/;

        this._appList = this._fetchInstalledApps();
        this.priority = 8;

        console.log("[WINDOWS_APP_FINDER]", "found installed apps: ", this._appList);
    }

    _fetchInstalledApps() {
        const p = spawn(this._POWERSHELL, [this._FETCH_APP_CMD], {timeout: 5000});
        const out = p.stdout.toString().trim().split('\n')
            .map(item => item.trim())
            .slice(2)
            .map(item => item.replace(/\s{2,}/gi, ':'))
            .map(item => item.split(':'))
            .filter(item => item.length > 1)
            .map(item => {return { '_name': item[0], '_id': item[1] }});

        return out;
    }

    async _executeApp(appId) {
        const p = spawn(this._POWERSHELL, [this._EXPLORER, this._RUN_APP + appId + "\""], {timeout: 1000});
        return p;
    }

    match(_cmd) {
        return _cmd.match(this.regex);;
    }

    draw(app) {
        return $("<li/>", {
            text: app._name, 
            class: "app",
            "data-type": "app"
        }).data("item", app);
    }

    execute(_cmd, callback, num) {
        if(_cmd.match(this.regex))
            num = undefined;
            
        _cmd = _cmd.replace(this.regex, "");
        console.log("[WINDOWS_APP_FINDER]", _cmd);
        
        this.getResults(_cmd, num)
            .then(apps => {
                console.log("[WINDOWS_APP_FINDER]", "found apps: ", apps);
                const appsDom = apps.map(app => this.draw(app));
                callback(appsDom);
            }).catch(err => callback(null, err));
    }

    run(app, callback) {
        this._executeApp(app._id)
            .then(res => callback(null, res))
            .catch(err => callback(err, null));
    }

    getResultFitness(query, app) {
        return app._name.toLowerCase().indexOf(query.toLowerCase());
    }

    async getResults(query, num) {
        num = num || this._appList.length;

        if(query.trim().length == 0) 
            return this._appList.slice(0, num);

        const filteredApps = this._appList
            .filter(app => app._name.toLowerCase().match(query.toLowerCase()))
            .sort((a, b) => this.getResultFitness(query, a) - this.getResultFitness(query, b))
            .slice(0, num);

        return filteredApps;
    }

}

module.exports = new WindowsAppFinder();