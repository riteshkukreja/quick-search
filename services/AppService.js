var Configurations 		= require("./Configurations");
var WindowsAppFinder 	= require("./WindowsAppFinder");
var NotificationService = require("./NotificationService");

var app = {};

app.regex = /appService:/;

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.execute = function(_cmd, callback) {
    WindowsAppFinder.run(_cmd, callback);
    //NotificationService.notify("App Service", "Your application has been started " + _cmd._name);
};

module.exports = app;