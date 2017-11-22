var Configurations = require("./Configurations");

var app = {};

app.regex = /config:/;
app.priority = 10;

app.match = function(_cmd) {
    return _cmd.match(app.regex);
};

app.draw = function(_result) {
    return $("<li/>", { 
        class: "result config",
        "data-type": "config" 
    }).data("item", _result)
        .append(
            $("<h4/>", { text: _result.title })
        ).append(
            $("<span/>", { text: _result.url })
        ).append(
            $("<p/>", { text: _result.description })
        );
};

var processResults = function(response) {
    var ret = [];
    for(res of response)
        ret.push(app.draw(res));
    return ret;
}

app.getResults = function(query, num, callback) {
	$.ajax({
        url: app.URL + query + "&limit=" + num,
        method: 'get',
        dataType: 'json',
        success: function(response) {
            if(typeof response.success != "undefined") {
                // failed
            } else {
                // success
                callback(processResults(response));
            }
        },
        failed: function(err) {

        }
    });
};

app.execute = function(_cmd, callback, num) {
    // remove handle if present
    _cmd = _cmd.replace(app.regex, "");

    app.getResults(_cmd, num ? num: app.limit, callback);
};

module.exports = app;