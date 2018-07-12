const UbuntuAppFinder     = require("./UbuntuAppFinder");
const WindowsAppFinder    = require("./WindowsAppFinder");

var app = {};

app.regex = /apps:/;

app.modules = [ WindowsAppFinder, UbuntuAppFinder];
app.default = WindowsAppFinder;

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.execute = function(_cmd, callback, num) {
    app.default.execute(_cmd, callback, num);
};

app.run = function(_cmd, callback) {
    app.default.run(_cmd, callback);
};

module.exports = app;