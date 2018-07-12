var SearchConstructor = require("./SearchConstructor");

var BingService = new SearchConstructor(
	"http://localhost/google_search/index.php?type=bing&q=",
    /bing:/,
    "Bing",
	function(_result) {
        return $("<li/>", { 
            class: "result bing",
            "data-type": "web" 
        })
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