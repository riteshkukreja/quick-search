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
	if(!instruction || instruction.trim().length == 0) return;

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

const getLast = function(query, num=5) {
	if(curr > num)
		return history.filter(a => a.trim().toLowerCase().includes(query.trim().toLowerCase())).slice(curr - num).reverse();
	return app.getAll();
}

const getAll = function(query) {
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

const draw = function(item) {
	return $("<li/>", {
        text: item, 
        class: "history",
        "data-type": "history"
    }).data("item", item);
}

const drawSettings = function(item, handler) {
	return $("<li/>", {
        text: item, 
        class: "result setting",
        "data-type": "setting"
	})
	.data("item", item)
	.data('handler', handler);
}

const clear = function() {
	history = [];
	curr = 0;
};

const clearHistoryButton = (e) => {
    console.log("clearing history");
	clear();
};

const processResults = function(response) {
	var ret = [];
	console.log("[HISTORY]",response);
    for(res of response)
        ret.push(draw(res));
    return ret;
};

const checkIfToShowClearButton = (_cmd, callback) => {
	const command = "Clear History";

	if(command.toLowerCase().includes(_cmd.toLowerCase())) {
		callback(drawSettings(command, clearHistoryButton));
	}
};

app.execute = function(_cmd, callback, num) {
	_cmd = _cmd.trim();

	if(_cmd.replace(/\s+/, "").length > 0) {
		_cmd = _cmd.replace(app.regex, "");

		const items = processResults(getAll(_cmd));
		callback(items, null);
	} else {
		callback(processResults(getLast(_cmd, num)));

		checkIfToShowClearButton(_cmd, callback);
	}
}

module.exports = app;