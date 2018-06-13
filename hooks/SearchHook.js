const Configuration         = require('../services/Configurations');

const GoogleService 		= require("../services/GoogleService");
const BingService 		    = require("../services/BingService");
const QuoraService 		    = require("../services/QuoraService");
const HistoryService 		= require("../services/HistoryService");
const WindowsAppFinder	    = require("../services/WindowsAppFinder");
const ConfigService		    = require("../services/ConfigService");

class SearchHook {
    constructor() {
        this.services = [
            Configuration.os,
            GoogleService,
            BingService,
            QuoraService,
            HistoryService,
            ConfigService
        ];
    }

    showError(res) {
        return $("<li/>", {
            text: res, 
            class: "error",
            "data-type": "error"
        }).data("item", res);
    };

    executeTagged(_cmd, callback) {
        /** Search for marked searches */
        console.log("[SEARCH_HOOK]", _cmd);
        try {
            for(const service of this.services) {
                if(service.match(_cmd)) {
                    console.log("[SEARCH_HOOK]", "found match: ", service.regex);
                    service.execute(_cmd, (response, err) => {
                        if(response == null) {
                            // show error
                            console.error("[SEARCH_HOOK]", err);
                            callback(this.showError(err), null);
                        } else {
                            // callback
                            console.log("[SEARCH_HOOK]", response, service.priority);
                            callback(null, {response: response, priority: service.priority});
                        }
                    }, Configuration.resultsCount);
                }
            }
        } catch(e) {
            console.error("[SEARCH_HOOK]", e);
            callback(this.showError(e), null);
        }
    }

    execute(_cmd, callback) {
        console.log("[SEARCH_HOOK]", _cmd);
    
        try {
            /** fallback to default search engine choice */
            Configuration.searchEngine.execute(_cmd, (response, err) => {
                console.log("[SEARCH_HOOK]", "found search: ", response, err);
                if(response == null) {
                    // show error
                    callback(this.showError(err), null);
                } else {
                    // callback
                    callback(null, {response: response, priority: Configuration.priority.low});
                }
            }, Configuration.resultsCount);

        } catch(e) {
            console.error("[SEARCH_HOOK]", e);
            callback(this.showError(e), null);
        }
    }
}

module.exports = new SearchHook();