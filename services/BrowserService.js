var Configurations 		= require("./Configurations");
var TerminalService 	= require("./TerminalService");
var NotificationService = require("./NotificationService");

var app = {};

app._cmd = "start chrome ";
app.regex = /web:/;

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.execute = function(_cmd, callback) {
    // remove handle if present
   // _cmd = _cmd.replace(app.regex, "");

    TerminalService.execute(app._cmd + _cmd, callback, 1);
    NotificationService.notify("Browser Service", "You have been redirected to your favourite browser for " + _cmd);
};

module.exports = app;