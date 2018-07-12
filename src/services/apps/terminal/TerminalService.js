var exec = require('child_process').exec;
const pathModule = require("path");

var app = {};
app.regex = /cmd:/;
app.priority = 8;

const path = require('os').homedir();
const cmd_pwd = "pwd";

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.draw = function(row) {
	return $("<li/>", {
        text: row, 
        class: "text",
        "data-type": "terminal"
    }).data("item", row);
};

app.drawLS = function(row, path) {
    return $("<li/>", {
        text: row, 
        class: row.match(/[\w\d\W\D]+\.[\w]+/) ? "file": "dir",
        "data-type": row.match(/[\w\d\W\D]+\.[\w]+/) ? "file": "dir"
    }).data("item", pathModule.join(path, row));
};

var processResults = function(response, _cmd) {
    var ret = [];
    if(_cmd.match("dir") || _cmd.match("ls")) {
        var path = $.trim(_cmd.replace(/dir/, "").replace(/ls/, ""));
    /*
        if(path.length > 0 && path[path.length-1] != "\/")
            path += "\/";*/

        path = path.replace(/\"/g, "");

        for(res of response) {
            ret.push(app.drawLS(res, path));
        }
    } else {
        for(res of response) {
            ret.push(app.draw(res));
        }    
    }
    
    return ret;
};

app.execute = function(_cmd, callback, num) {
	// remove handle if present
	_cmd = _cmd.replace(app.regex, "");

    const p = exec(_cmd, { timeout: 1000, cwd: path }, (e, stdout, stderr) => {
        if(e) {
            callback(stderr, null);
        } else if(stdout) {
            stdout = $.trim(stdout).split("\n");
            callback(null, { response: processResults(stdout, _cmd), priority: app.priority });
        } else {
            callback("Something went wrong!", null);
        }
    })
};

module.exports = app;