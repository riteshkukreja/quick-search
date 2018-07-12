const Configuration         = require('../services/configurations/Configurations');

const HistoryService 		= require("../services/history/HistoryService");
const ConfigService		    = require("../services/configurations/ConfigService");
const SettingService	    = require("../services/apps/SettingService");
const AppService            = require("../services/desktop/AppService");
const SearchService		    = require("../services/web/SearchService");

class KeyDownHook {
    constructor() {
        this.services = [
            AppService,
            HistoryService,
            ConfigService,
            SettingService,
            SearchService
        ];
    }

    showError(res) {
        return $("<li/>", {
            text: res, 
            class: "error",
            "data-type": "error"
        }).data("item", res);
    };

    execute(_cmd, callback) {
        /** Search for marked searches */
        console.log("[KEY_DOWN_HOOK]", _cmd);
        try {
            for(const service of this.services) {
                service.execute(_cmd, (response, err) => {
                    console.log("[KEY_DOWN_HOOK]", service.regex, response, err);

                    if(response == null) {
                        // show error
                        callback(this.showError(err), null);
                    } else {
                        // callback
                        callback(null, {response: response, priority: service.priority});
                    }
                }, Configuration.resultsCount);
            }
        } catch(e) {
            console.error(e);
            callback(this.showError(e), null);
        }
    }
}

module.exports = new KeyDownHook();