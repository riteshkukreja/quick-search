var SearchConstructor = require("./SearchConstructor");

var GoogleService = new SearchConstructor(
	"http://localhost/google_search.php?type=google&q=",
	/google:/,
	function(_result) {
        return $("<li/>", { 
            class: "result google",
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

module.exports = GoogleService;