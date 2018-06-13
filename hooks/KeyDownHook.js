const Configuration         = require('../services/Configurations');

const HistoryService 		= require("../services/HistoryService");
const ConfigService		    = require("../services/ConfigService");
const SettingService	    = require("../services/SettingService");

class KeyDownHook {
    constructor() {
        this.services = [
            Configuration.os,
            HistoryService,
            ConfigService,
            SettingService
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