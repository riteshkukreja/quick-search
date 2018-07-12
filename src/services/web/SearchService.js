const GoogleService 		= require("./GoogleService");
const BingService 			= require("./BingService");
const QuoraService 			= require("./QuoraService");

var app = {};
app.modules = [
	GoogleService,
	BingService,
	QuoraService,
];

app.default = GoogleService;
app.priority = 5;

app.match = function(_cmd) {
	return GoogleService.match(_cmd) || BingService.match(_cmd) || QuoraService.match(_cmd);
};

app.execute = function(_cmd, callback, num) {
	try {
		_cmd = _cmd.trim();
        if(_cmd.length == 0) {
            return;
        }

		for(mod of app.modules) {
			if(mod.match(_cmd)) {
				mod.execute(_cmd, (response, err) => {
					if(response == null) {
						// show error
						callback(null, err);
					} else {
						// callback
						callback(response, null);
					}
				}, num);
				
				return;
			}
		}

		// fallback to default choice
		app.default.execute(_cmd, (response, err) => {
			if(response == null) {
				// show error
				callback(null, err);
			} else {
				// callback
				callback(response, null);
			}
		}, num);
	} catch(e) {
		console.log(e);
		callback(null, e);
	}
};

module.exports = app;