const SearchService = require("../web/SearchService");
const AppService = require('../desktop/AppService');

const app = {};

app.searchEngines = SearchService.modules;
app.searchEngine = SearchService.default;

app.supportedOS = AppService.modules;
app.os = AppService.default;

app.resultsCount = 5;
app.lastHistoryCount = 5;
app.isInternetConnected = true;
app.NetworkMissingMessage = "You are not connected to internet";

app.priority = {
	high: 10,
	low: 1
};

app.init = function() {
	try {
		SearchService.execute("test", function(response, err) {
			if(err || typeof response == "undefined" || response == null || response.length == 0) {
				app.isInternetConnected = false;
			} else {
				app.isInternetConnected = true;
			}
			
		}, 1);
	} catch(e) {
		app.isInternetConnected = false;
	}
}

module.exports = app;