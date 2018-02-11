var Configurations = require("./Configurations");

var app = {};

app.regex = /config:/;
app.priority = 10;

app.match = function(_cmd) {
    console.log("[CONFIG]", _cmd);
    return _cmd.match(app.regex);
};

app.draw = function(_result) {
    return $("<li/>", { 
        class: "result config",
        "data-type": "config" 
    }).data("item", _result)
        .append(
            $("<h4/>")
                .append($("<span/>", { text: _result.title, style: 'font-weight: 100; margin-right: 10px;' }))
                .append($("<span/>", { text: _result.val }))
        );
};

app.getResults = function() {
	const configs = [
        { title: 'Search Engine', val: Configurations['searchEngine'].name },
        { title: 'Number of results per page', val: Configurations['resultsCount'] },
        { title: 'Number of history items', val: Configurations['lastHistoryCount'] },
        { title: 'Connected to internet', val: Configurations['isInternetConnected'] }
    ];

    return configs.slice()
        .map(item => app.draw(item));
};

app.execute = function(_cmd, callback, num) {
    console.log("[CONFIG]", _cmd);

    const configs = app.getResults();
    callback(configs);
};

module.exports = app;