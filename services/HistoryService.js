var app = {};
var history = [];
var curr = 0;
app.regex = /history:/;
app.updated = false;
app.priority = 5;

app.match = function(_cmd) {
    return _cmd.replace(/\s+/, "").length == 0 || _cmd.match(app.regex);
};

app.push = function(instruction) {
	app.updated = false;
	for(var i = history.length-1; i >= 0; i--) {
		if(history[i] == instruction) {
			history.splice(i, 1);
			break;
		}
	}

	history.push(instruction);
	curr++;
}

app.getLast = function(num) {
	if(curr > num)
		return history.slice(curr - num).reverse();
	return history.slice().reverse();
}

app.getAll = function() {
	return history.slice().reverse();
}

app.next = function() {
	app.updated = false;
	if(curr < history.length) {
		curr++;
		return history[curr-1];
	}
	return null;
}

app.hasNext = function() {
	if(curr < history.length) {
		return true;
	}
	return false;
}

app.hasPrev = function() {
	if(curr > 1 || app.updated) {
		return true;
	}
	return false;
}

app.prev = function() {
	if(app.updated && curr > 0) {
		app.updated = false;
		return history[curr-1];
	}
	if(curr > 1) {
		curr--;
		return history[curr-1];
	}

	return null;
}

app.draw = function(item) {
	return $("<li/>", {
        text: item, 
        class: "history",
        "data-type": "history"
    }).data("item", item);
}

var processResults = function(response) {
    var ret = [];
    for(res of response)
        ret.push(app.draw(res));
    return ret;
};

app.execute = function(_cmd, callback, num) {
	if(_cmd.replace(/\s+/, "").length > 0) {
		_cmd = _cmd.replace(app.regex, "");

		if(_cmd.match(/clear/)) {
			history = [];
			curr = 0;
			callback(processResults(["History has been cleared"]));
		} else
			callback(processResults(app.getAll()));
	} else {
		callback(processResults(app.getLast(num)));
	}
}

module.exports = app;