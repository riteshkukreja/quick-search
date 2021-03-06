var SearchConstructor = require("./SearchConstructor");

var GoogleService = new SearchConstructor(
	"http://localhost/google_search/index.php?type=google&q=",
    /google:/,
    "Google",
	function(_result) {
        return $("<li/>", { 
            class: "result google",
            "data-type": "web"  
        })
        .append(
            $("<h4/>", { text: _result.title })
        ).append(
            $("<span/>", { text: _result.url })
        ).append(
            $("<p/>", { text: _result.description.slice(0, 100) })
        );
    }
);

module.exports = GoogleService;