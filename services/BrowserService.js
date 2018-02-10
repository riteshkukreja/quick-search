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
   /** Check url */
   _cmd = _cmd.replace(/^\//, '');

    TerminalService.execute(app._cmd + _cmd, callback, 1);
    NotificationService.notify("Browser Service", "Opened " + _cmd);
};

module.exports = app;