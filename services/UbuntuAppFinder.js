var exec = require('child_process').execSync;

var app = {};
app.APP_DIRS = [
	"/usr/share/applications/",
	"~/.local/share/applications/"
];

app.CACHE_FILE = "applications.cache";

var Application = function(name, path, _cmd) {
	this.name = name;
	this.path = path;
	this._cmd = _cmd;
};

app.list = [];

app.parse = function(desktopLink) {
	var app = new Application("", desktopLink, "");

	// get _cmd of app
	var Exec_cmd = `grep '^Exec' ${desktopLink} | tail -1 | sed 's/^Exec=//' | sed 's/%.//' | sed 's/^"//g' | sed 's/" *$//g'`;
	exec(Exec_cmd, {timeout: 1000}, (e, stdout, stderr) => {
		if(e) {
            console.log(stderr);
        } else if(stdout) {
            stdout = $.trim(stdout).split("\n");
            app._cmd = stdout[0];
        }
	});

	// get title of app
	var Title_cmd = `grep '^Name' ${desktopLink} | tail -1 | sed 's/^Name=//' | sed 's/%.//' | sed 's/^"//g' | sed 's/" *$//g'`;
	exec(Title_cmd, {timeout: 1000}, (e, stdout, stderr) => {
		if(e) {
            console.log(stderr);
        } else if(stdout) {
            stdout = $.trim(stdout).split("\n");
            app._cmd = stdout[0];
        }
	});

	return app;
};

app.handleAppDir = function(dir) {
	var _cmd = "for app in " + dir + "*.desktop; do echo \"${app}\"; done";

	exec(_cmd, {timeout: 1000}, (e, stdout, stderr) => {
		if(e) {
            console.log(stderr);
        } else if(stdout) {
            stdout = $.trim(stdout).split("\n");
            
            for(var s of stdout) {
            	app.list.push(app.parse(dir + s));
            }
        }
	});
};

app.listAll = function() {
	for (var dirs of app.APP_DIRS) {
		app.handleAppDir(dirs);
	}
};

app.get = function() {

};

app.search = function(query) {

};

app.execute = function() {

};

app.load = function() {

};

app.persist = function() {

};

module.exports = app;