const BrowserService = require("./BrowserService");
const CacheService   = require("../utils/CacheService");

var app = function(url, regex, name, drawCallback, executeCallback, limit, priority, timeout) {
    this.URL = url;
    this.limit = limit || 5;
    this.regex = regex;
    this.name = name;
    this.priority = priority || 5;
    this.timeout = timeout || 4 * 60 * 60 * 1000; // 4 hours
    var lastRequest = null;

    var self = this;

    this.match = function(_cmd) {
        return _cmd.match(this.regex);
    };

    this.draw = function(_result) {
        if(drawCallback)
            return drawCallback(_result)
                .data("item", _result)
                .data("handler", async (e) => await BrowserService.execute(_result.url));

        return $("<li/>", { 
            class: "result sample",
            "data-type": "web" ,
            text: JSON.stringify(_result)
        })
            .data("item", _result)
            .data("handler", async (e) => await BrowserService.execute(_result.url));
    };

    var processResults = function(response) {
        var ret = [];
        for(res of response)
            ret.push(self.draw(res));
        return ret;
    }

    this.getResults = function(query, num, callback) {
        query = query.trim();
        if(query.length == 0) {
            return;
        }

        /** Check cache */
		if(CacheService.has(this.name + ":" + query)) {
            var cachedResponse = CacheService.get(this.name + ":" + query);
            if(cachedResponse.limit >= num) {
                var sets = cachedResponse.payload.slice(0, num);
				callback(sets, null);
				
                return;
            }
        }

        lastRequest = $.ajax({
            url: this.URL + query + "&limit=" + num,
            method: 'get',
            dataType: 'json',
            beforeSend : function()    {           
                if(lastRequest != null) {
                    lastRequest.abort();
                }
            },
            success: function(response) {
                if(typeof response.success != "undefined" || response == null || response.length == 0) {
                    // failed
                    callback(null, "You are not connected to internet");
                } else {
                    // success 
                    CacheService.save(this.name + ":" + query, {payload: response, limit: num}, self.timeout);
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