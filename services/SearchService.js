var Configurations = require("./Configurations");

var GoogleService 		= require("./GoogleService");
var BingService 		= require("./BingService");
var QuoraService 		= require("./QuoraService");
var TerminalService 	= require("./TerminalService");
var HistoryService 		= require("./HistoryService");
var WindowsAppFinder	= require("./WindowsAppFinder");

var app = {};
app.modules = [
	GoogleService,
	BingService,
	QuoraService,
	TerminalService,
	HistoryService,
	WindowsAppFinder
];

var showError = function(res) {
	return $("<li/>", {
        text: res, 
        class: "error",
        "data-type": "error"
    }).data("item", res);
};

app.execute = function(_cmd, callback) {
	try {
		for(mod of app.modules) {
			if(mod.match(_cmd)) {
				mod.execute(_cmd, (response, err) => {
					if(response == null) {
						// show error
						callback(null, showError(err));
					} else {
						// callback
						callback({response: response, priority: mod.priority}, null);
					}
				}, Configurations.resultsCount);
				return;
			}
		}

		/** Show apps */
		WindowsAppFinder.execute(_cmd, (response, err) => {
			if(response == null) {
				// show error
				callback(null, showError(err));
			} else {
				// callback
				callback({response: response, priority: Configurations.searchEngine.priority}, null);
			}
		}, Configurations.resultsCount);

		// fallback to default choice
		Configurations.searchEngine.execute(_cmd, (response, err) => {
			if(response == null) {
				// show error
				callback(null, showError(err));
			} else {
				// callback
				callback({response: response, priority: Configurations.searchEngine.priority}, null);
			}
		}, Configurations.resultsCount);
	} catch(e) {
		console.log(e);
		callback(null, showError(e));
	}
};

module.exports = app;