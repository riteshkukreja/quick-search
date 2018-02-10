var SearchConstructor = require("./SearchConstructor");

var QuoraService = new SearchConstructor(
    "http://localhost/google_search/index.php?type=quora&q=",
    /quora:/,
    function(_result) {
        return $("<li/>", { 
            class: "result quora", 
            "data-type": "web" 
        }).data("item", _result)
            .append(
                $("<h4/>", { text: _result.title })
            ).append(
                $("<p/>", { text: _result.description })
            );
    }
);

module.exports = QuoraService;