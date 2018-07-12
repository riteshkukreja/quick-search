const remote = require('electron').remote;
const win = remote.getCurrentWindow();

var app = {};

app.hide = function() {
	win.hide();
};

app.close = function() {
	win.close();
};

app.onShow = function(callback) {
	if(typeof callback == "function") {
		win.on("show", callback);
        
        $(document.body).on("keyup", function (e) {
            if(e.keyCode == 27) {
                app.hide();
            }
        }); 
        
        $(document.body).on("click", function(e) {
            if(e.target == document.body) {
                app.hide();
            }
        });
	}
};

module.exports = app;