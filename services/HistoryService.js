var app = {};
var history = [];
var curr = 0;
app.regex = /history:/;
app.updated = false;
app.priority = 3;

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.push = function(instruction) {
	if(instruction.trim().length == 0) return;

	instruction = instruction.trim();

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

app.getLast = function(query, num=5) {
	if(curr > num)
		return history.filter(a => a.trim().toLowerCase().includes(query.trim().toLowerCase())).slice(curr - num).reverse();
	return app.getAll();
}

app.getAll = function(query) {
	query = query || "";
	return history.filter(a => a.trim().toLowerCase().includes(query.trim().toLowerCase())).reverse();
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

app.clear = function() {
	history = [];
	curr = 0;
};

var processResults = function(response) {
	var ret = [];
	console.log("[HISTORY]",response);
    for(res of response)
        ret.push(app.draw(res));
    return ret;
};

app.execute = function(_cmd, callback, num) {
	if(_cmd.replace(/\s+/, "").length > 0) {
		_cmd = _cmd.replace(app.regex, "");

		const items = processResults(app.getAll(_cmd));
		callback(items, null);
	} else {
		callback(processResults(app.getLast(_cmd, num)));
	}
}

module.exports = app;