const TerminalService = require("./terminal/TerminalService");

const mockedService = {
    execute: (_cmd, callback) => callback("Mocked Service executed", null)
};

var app = {};

app.regex = /settings:/;
app.priority = 10;

app.selectedService = null;//mockedService;

app.match = function(_cmd) {
    return false;
};

app.draw = function(_result) {
    return $("<li/>", { 
        class: "result setting",
        "data-type": "setting" 
    }).data("item", _result)
    .append(
        $("<h4/>")
            .append($("<span/>", { text: _result.title, style: 'font-weight: 100; margin-right: 10px;' }))
    )
    .data('handler', _result.handler);
};

app.getResults = function(query) {
	const configs = [];

    if(app.selectedService == TerminalService) {
        configs.push(
            { title: 'Stop Terminal (Internal)', handler: () => app.selectedService = mockedService }
        );
    } else {
        configs.push(
            { title: 'Terminal (Internal)', handler: () => app.selectedService = TerminalService }
        );
    }

    const ret = configs.slice()
        .filter(a => query.trim().length > 0 && JSON.stringify(a).toLowerCase().includes(query.trim().toLowerCase()))
        .map(item => app.draw(item));

    return ret;
};

app.execute = function(_cmd, callback, num) {
    console.log("[SETTING]", _cmd);
    const configs = app.getResults(_cmd);
    callback(configs);

    if(app.selectedService == TerminalService) {
        callback(null, "Connected to Terminal (Internal)");
    }
};

module.exports = app;