const remote = require('electron').remote;
var exec = require('child_process').exec;
var log = require('electron-log');

var HistoryService  = require("../services/HistoryService");
var Configurations  = require("../services/Configurations");
var SearchService   = require("../services/SearchService");
var WebService      = require("../services/WebService");

var textarea = $("#search");
var resultArea = $("#results");
var win = remote.getCurrentWindow();

Configurations.init();

textarea.focus();

function toggleResults(show) {
    if(show && resultArea.children().length > 0) {
        resultArea.slideDown(200);
        textarea.addClass("results");
    } else {
        resultArea.slideUp(200);
        setTimeout(function() {
            resultArea.html("");
            textarea.removeClass("results");
        }, 10);        
    }
}

function isFirstResult(res) {
    return resultArea.children(0) == res;
}

function isLastResult(res) {
    return resultArea.children(resultArea.children().length-1) == res;
}

function selectResult(pos) {
    $("li").removeClass("selected");
    $($("li")[pos]).addClass("selected");
    selectedResult = $($("li")[pos]);
}

var debounceTime = 1000;
var timeoutHandler = null;

textarea.on("keyup", function(e) {
    switch(e.keyCode) {
        case 27:    runaway();
                    break;
        case 37:    // check cursor position to be first
                    if(textarea.prop("selectionStart") > 0 
                        || textarea.prop("selectionStart") != textarea.prop("selectionEnd"))
                        break;
                    // load last instruction
                    if(HistoryService.hasPrev()) {
                        textarea.val(HistoryService.prev());
                    }
                    break;
        case 38:    // check if top of the list
                    if(selectedResult && selectedResult.prev().length > 0) {
                        selectedResult.prev().addClass("selected");
                        selectedResult.removeClass("selected");
                        selectedResult = selectedResult.prev();

                        handleScroll();
                        e.preventDefault();
                    } else if(selectedResult) {
                        selectedResult.removeClass("selected");
                        selectedResult = null;
                    }
                    break;
        case 39:    // check cursor position to be last
                    if(textarea.prop("selectionStart") < textarea.val().length 
                        || textarea.prop("selectionStart") != textarea.prop("selectionEnd"))
                        break;
                    // load next instruction if any
                    if(HistoryService.hasNext()) {
                        textarea.val(HistoryService.next());
                    }
                    break;
        case 40:    // check if bottom of the list
                    if(selectedResult && selectedResult.next().length > 0) {
                        selectedResult.next().addClass("selected");
                        selectedResult.removeClass("selected");
                        selectedResult = selectedResult.next();
                        e.preventDefault();
                    } else {
                        selectResult(0);
                    }

                    handleScroll();
                    break;
        case 13:    if(textarea.val().toLowerCase() == "exit") {
                        log.info("Sending quit message to window");
                        win.close();
                    }
                            
                    else if(selectedResult == null) {
                        // if textarea is focused and no result is selected
                        HistoryService.push(textarea.val());
                        webSearch("cmd:" + textarea.val());
                        
                    } else {
                        onResultClick();
                    }
                    break;
        default:
                    toggleResults(false);
                    HistoryService.updated = true;
                    
                    if(timeoutHandler) {
                        window.clearTimeout(timeoutHandler);
                    }
                    timeoutHandler = setTimeout(function() {
                        webSearch($.trim(textarea.val()));
                    }, debounceTime);
    }
});


/** 
    @TODO
    -   Moves eratically on selecting results on mouse key up and down
**/
function handleScroll(top) {
    if(selectedResult == null) {
        resultArea.animate({
            scrollTop: 0
        }, 200);
        return;
    };

    var selected_top = selectedResult.offset().top - $( document ).scrollTop();
    var selected_bottom = selected_top + selectedResult.height() + 20;
    var ul_height = resultArea.height();
    var ul_scrollTop = resultArea.scrollTop();

    console.log(selected_top, selected_bottom, ul_height, ul_scrollTop, selected_bottom - ul_height);

    if(selected_bottom > ul_height || selected_top < ul_scrollTop ) {
        resultArea.animate({
            scrollTop: parseInt(selected_bottom)
        }, 200);
    }
}

function webSearch(query) {
    SearchService.execute(query, function(response, error) {
        if($.trim(textarea.val()).length == 0 || query.indexOf($.trim(textarea.val())) == -1) return;

        if(response == null) {
            resultArea.prepend(error);
            return;
        }
        
        for(res of response) {
            // handle click event
            res.click(function() {
                if(selectedResult)
                    selectedResult.removeClass("selected");
                selectedResult = $(this);
                selectedResult.addClass("selected");

                // execute
                onResultClick();
            });

            res.on("mouseenter", function() {
                if(selectedResult)
                    selectedResult.removeClass("selected");
                selectedResult = $(this);
                selectedResult.addClass("selected");
            });

            res.on("mouseleave", function() {
                if(selectedResult)
                    selectedResult.removeClass("selected");
                selectedResult = $(this);
                selectedResult.addClass("selected");
            });

            resultArea.append(res);
        }

        toggleResults(true);
    });
}

function onResultClick() {
    var data_type = selectedResult.data("type");
    var data_item = selectedResult.data("item");

    if(data_type == "web") {
        HistoryService.push(textarea.val());
        WebService.execute(data_item.url, function(response) {console.log(response);}, 1);
    } else if(data_type == "history") {
        toggleResults(false);
        HistoryService.push(data_item);
        textarea.val(data_item);
        selectedResult.removeClass("selected");
    } else if(data_type == "file") {
        toggleResults(false);
        var fileName = data_item;
        textarea.val("cat " + fileName);        
        HistoryService.push("cat " + fileName);
        webSearch("cmd:cat " + fileName);
    } else if(data_type == "dir") {
        toggleResults(false);
        var fileName = data_item;
        textarea.val("ls " + fileName);
        HistoryService.push("ls " + fileName);
        webSearch("cmd:ls " + fileName);
    } else {

    }
    
    selectedResult = null;
}

function clearInput() {
    textarea.val("");
    toggleResults(false);
    HistoryService.updated = true;
}

function runaway() {
    //clearInput();
    win.hide();
}

var selectedResult = null;
$(document.body).on("keyup", function (e) {
    switch(e.keyCode) {
        case 27:    runaway();
                    break;
    }
}); 

$(document.body).on("click", function(e) {
    if(e.target == document.body)
        runaway();
});

win.on("show", () => {
    //clearInput();
    textarea.focus();
});