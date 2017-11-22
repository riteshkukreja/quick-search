var SearchConstructor = require("./SearchConstructor");

var BingService = new SearchConstructor(
	"http://localhost/google_search.php?type=bing&q=",
	/bing:/,
	function(_result) {
        return $("<li/>", { 
            class: "result bing",
            "data-type": "web" 
        }).data("item", _result)
            .append(
                $("<h4/>", { text: _result.title })
            ).append(
                $("<span/>", { text: _result.url })
            ).append(
                $("<p/>", { text: _result.description })
            );
    }
);

module.exports = BingService;