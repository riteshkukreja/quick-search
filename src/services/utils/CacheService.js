const fs = require("fs");

var app = {};

app.CACHE_FILE = "app.cache";
app.store = {};

var TimeBasedCache = function(key, val, timeout) {
	this.key = key;
	this.vals = val;
	this.expiringOn = (new Date()).getTime() + timeout;
};

app.get = function(query) {
	if(app.has(query)) {
		return app.store[query].vals;
	}
	return null;
};

app.has = function(query) {
	if(typeof app.store[query] != "undefined") {
		if(app.store[query].expiringOn <= (new Date()).getTime() ) {
			delete app.store[query];
			return false;
		}

		return true;
	}
	return false;
};

app.save = function(query, results, timeout) {
	// insert or override cache
	app.store[query] = new TimeBasedCache(query, results, timeout);
};

app.clear = function() {
	app.store = {};
};

app.persist = function() {
	fs.writeFileSync(app.CACHE_FILE, JSON.stringify(app.store) );
};

app.load = function(callback) {
	try {
		fs.readFile(app.CACHE_FILE, function(err, response) { 
			try {
				if(err || !response || response.length == 0)
					throw "Cache file not found exception";

				console.log(err, response.toString());
				app.store = JSON.parse(response.toString()); 
			} catch(e) {
				console.log(e);
			}

			if(typeof callback == "function")
				callback();
		});
	} catch(e) {
		console.log(e);
	}
};

// app.load();

module.exports = app;