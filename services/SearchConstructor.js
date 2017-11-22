var CacheService    = require("./CacheService");

var app = function(url, regex, drawCallback, executeCallback, limit, priority, timeout) {
    this.URL = url;
    this.limit = limit || 5;
    this.regex = regex;
    this.priority = priority || 5;
    this.timeout = timeout || 4 * 60 * 60 * 1000; // 4 hours

    var self = this;

    this.match = function(_cmd) {
        return _cmd.match(this.regex);
    };

    this.draw = drawCallback || function(_result) {
        return $("<li/>", { 
            class: "result sample",
            "data-type": "web" ,
            text: JSON.stringify(_result)
        }).data("item", _result);
    };

    var processResults = function(response) {
        var ret = [];
        for(res of response)
            ret.push(self.draw(res));
        return ret;
    }

    this.getResults = function(query, num, callback) {
        if(CacheService.has(regex + query)) {
            var cachedResponse = CacheService.get(regex + query);
            if(cachedResponse.limit >= num) {
                var sets = cachedResponse.payload.slice(0, num);
                callback(processResults(sets));
                return;
            }
        }

        $.ajax({
            url: this.URL + query + "&limit=" + num,
            method: 'get',
            dataType: 'json',
            success: function(response) {
                if(typeof response.success != "undefined" || response == null || response.length == 0) {
                    // failed
                    callback(null, "You are not connected to internet");
                } else {
                    // success 
                    // update cache
                    CacheService.save(regex + query, {payload: response, limit: num}, self.timeout);

                    // callback
                    callback(processResults(response));
                }
            },
            failed: function(err) {
                callback(null, err);
            }
        });
    };

    this.execute = executeCallback || function(_cmd, callback, num) {
        // remove handle if present
        _cmd = _cmd.replace(this.regex, "");

        this.getResults(_cmd, num ? num: this.limit, callback);
    };
};



module.exports = app;