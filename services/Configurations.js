var GoogleService = require("../services/GoogleService");
var BingService = require("../services/BingService");
var QuoraService = require("../services/QuoraService");

const WindowAppFinder = require('./WindowsAppFinder');
const UbuntuAppFinder = require('./UbuntuAppFinder');

var app = {};

app.loadConfigurations = function() {

}

app.saveConfigurations = function() {

}

app.searchEngines = [GoogleService, BingService, QuoraService];
app.searchEngine = app.searchEngines[0];

app.supportedOS = [WindowAppFinder, UbuntuAppFinder];
app.os = app.supportedOS[0];

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
		GoogleService.execute("test", function(response, err) {
			if(typeof response == "undefined" || response == null || response.length == 0) {
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