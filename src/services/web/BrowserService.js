var exec = require('child_process').exec;
var app = {};

app._cmd = "start chrome ";
app.regex = /web:/;

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.execute = async function(_cmd) {
    // remove handle if present
   // _cmd = _cmd.replace(app.regex, "");
   /** Check url */
   _cmd = _cmd.replace(/^\//, '');

   return new Promise((resolve, reject) => {
        exec(app._cmd + _cmd, { timeout: 1000 }, (e, stdout, stderr) => {
            if(e || stderr) reject(stderr);
            else resolve(stdout);
        });
   });
};

module.exports = app;