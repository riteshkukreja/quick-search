var request = require("request");
var cheerio = require("cheerio");

var app = {};

app.get = function(url, success, error) {
	request(url, function(err, response, html) {
		if(err || response.statusCode != 200) error(err);
		else {
			success(html);
		}
	});
}

app.errorcallback = function(err) {
	console.log(err);
}

app.getPage = function(url, success) {
	this.get(url, success, this.errorcallback);
}

app.parseHTML = function(url, callback) {
	this.getPage(url, function(code) {
		callback(cheerio.load(code), {  });
	});	
}

module.exports = app;

