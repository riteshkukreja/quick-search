var Configurations 		= require("./Configurations");
var WindowsAppFinder 	= require("./WindowsAppFinder");
var NotificationService = require("./NotificationService");

var app = {};

app.regex = /appService:/;

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.execute = function(_cmd, callback) {
    Configurations.os.run(_cmd, callback);
};

module.exports = app;