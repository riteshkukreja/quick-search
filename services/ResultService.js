var log = require('electron-log');

var HistoryService      = require("./HistoryService");
var Configurations      = require("./Configurations");
var SearchService       = require("./SearchService");
var BrowserService      = require("./BrowserService");
var AppService          = require("./AppService");
var SettingService      = require("./SettingService");
var WindowService       = require("./WindowService");

const KeyDownHook       = require('../hooks/KeyDownHook');
const SearchHook        = require('../hooks/SearchHook');

var app = {};
var debounceTime = 200;
var timeoutHandler = null;
var selectedResult = null;

app.bootstrap = function(parent, textarea) {
    app.parent = parent;
    app.input = textarea;

    app.init();
};

app.init = function() {
    Configurations.init();
    
    WindowService.onShow(function() {
        app.input.focus();
    });

    app.input.focus();

    app.initilizeInputArea();
};

app.toggle = function(visibility) {
    if(visibility && app.parent.children().length > 0) {
        app.input.addClass("results");
        app.parent.slideDown(100);
    } else {
        app.parent.slideUp(100);
        setTimeout(function() {
            app.input.removeClass("results");
        }, 100);        
    }
};

app.selectResult = function(element) {
    if(selectedResult != null)
        selectedResult.removeClass("selected");

    if(element != null)
        element.addClass("selected");

    selectedResult = element;
};

app.selectNext = function() {
    // check if at last of list or no result selected
    if(selectedResult == null || selectedResult.next().length == 0)
        app.selectResult(app.parent.children().first());
    else {
        app.selectResult(selectedResult.next());
    }
};

app.selectPrev = function() {
    // check if at top of list or no result selected
    if(selectedResult == null || selectedResult.prev().length == 0)
        app.selectResult(null);
    else {
        app.selectResult(selectedResult.prev());
    }
};

app.showHistoryItem = function() {
    // check cursor position to be first
    if(app.input.prop("selectionStart") > 0 
        || app.input.prop("selectionStart") != app.input.prop("selectionEnd"))
        return;
    // load last instruction
    if(HistoryService.hasPrev()) {
        app.input.val(HistoryService.prev());
        app.updated();
    }
};

app.showFutureItem = function() {
    // check cursor position to be last
    if(app.input.prop("selectionStart") < app.input.val().length 
        || app.input.prop("selectionStart") != app.input.prop("selectionEnd"))
        return;
    // load next instruction if any
    if(HistoryService.hasNext()) {
        app.input.val(HistoryService.next());
        app.updated();
    }
};

app.updateSearch = function(query) {
    app.updated();
    HistoryService.push(query);
    textarea.val(query);
};

app.onResultClick = function(e) {
    var data_type = selectedResult.data("type");
    var data_item = selectedResult.data("item");
    console.log(data_type, data_item);

    switch(data_type) {
        case "web":
                HistoryService.push(textarea.val());
                BrowserService.execute(data_item.url, function(response) {}, 1);
                break;
        case "history":
                app.updateSearch(data_item);
                app.handleKeyDownHook(data_item);
                app.handleSearchHook(data_item);
                break;
        case "file":
                app.updateSearch("cat \"" + data_item + "\"");
                app.handleEnterPress("cmd:cat \"" + data_item + "\"");
                break;                
        case "dir":
                app.updateSearch("ls \"" + data_item + "\"");
                app.handleEnterPress("cmd:ls \"" + data_item + "\"");
                break;
        case "app":
                HistoryService.push(data_item._name);
                AppService.execute(data_item, (response) => {}, 1);
                app.clear();
                break;
        default:
                selectedResult.data('handler')(e);
                break;
    }
    

    app.selectResult(null);
};

app.prepareResults = function(results, priority) {
    if(!results) return [];

    for(const res of results) {
        // handle click event
        res.click(function(e) {
            app.selectResult($(this));

            // execute
            app.onResultClick(e);
        });

        res.on("mouseenter", function() {
            app.selectResult($(this));
        });

        res.on("mouseleave", function() {
            app.selectResult(null);
        });

        res.data('priority', priority);
    }

    return results;
};

app.prioritize = function(results, priority) {
    results = app.prepareResults(results, priority);
    
    for(res of results) {
        app.parent.append(res);
    }

    const resultItems = app.parent.children();
    resultItems.sort((a, b) => $(b).data('priority') - $(a).data('priority'));
    resultItems.detach().appendTo(app.parent);

    if(resultItems.length > 0) {
        app.toggle(true);
    } else {
        app.toggle(false);
    }
};

app.showError = function(res) {
	return $("<li/>", {
        text: res, 
        class: "error",
        "data-type": "error"
    }).data("item", res);
};

app.handleSearchHook = function(query) {
    SearchHook.executeTagged(query, (err, response) => {
        if((app.input.val().trim().length == 0 && query.trim().length != 0 ) || query.indexOf($.trim(app.input.val())) == -1) return;

        if(err) {
            app.prioritize([err], Configurations.priority.high);
            return;
        }

        if(response.response.length > 0) {
            app.parent.html("");
            app.prioritize(response.response, response.priority);
            app.toggle(true);
        } else {
            SearchHook.execute(query, (err, response) => {
                if((app.input.val().trim().length == 0 && query.trim().length != 0 ) || query.indexOf($.trim(app.input.val())) == -1) return;
        
                if(err) {
                    app.prioritize([err], Configurations.priority.high);
                    return;
                }
                
                app.prioritize(response.response, response.priority);
                app.toggle(true);
            });
        }
    });
};

app.handleKeyDownHook = (query) => {
    app.parent.html("");
    KeyDownHook.execute(query, (err, res) => {
        if((app.input.val().trim().length == 0 && query.trim().length != 0 ) || query.indexOf($.trim(app.input.val())) == -1) return;

        if(err) {
            app.prioritize([err], Configurations.priority.high);
            return;
        }
        
        app.prioritize(res.response, res.priority);
        app.toggle(true);
    });
};

app.handleEnterPress = (query) => {
    app.parent.html("");
    SettingService.selectedService.execute(query, (err, res) => {
        if((app.input.val().trim().length == 0 && query.trim().length != 0 ) || query.indexOf($.trim(app.input.val())) == -1) return;

        console.log("enter press", err, res);

        if(err) {
            app.prioritize([app.showError(err)], Configurations.priority.high);
            return;
        }
        
        app.prioritize(res.response, res.priority);
        app.toggle(true);
    });
};

app.clear = function() {
    app.input.val("");
    app.updated();
};

app.initilizeInputArea = function() {
    app.input.on("keyup", function(e) {
        switch(e.keyCode) {
            case 27:    WindowService.hide();
                        break;

            case 37:    // Go back in history if possible
                        app.showHistoryItem();
                        break;

            case 38:    // Go to previous result
                        app.selectPrev();
                        break;

            case 39:    // Go to future if possible
                        app.showFutureItem();
                        break;

            case 40:    // Go to next result
                        app.selectNext();
                        break;

            case 13:    // exit condition
                        if(app.input.val().toLowerCase() == "exit") {
                            log.info("Sending quit message to window");
                            WindowService.close();
                        } else if(selectedResult == null) {
                            // if textarea is focused and no result is selected
                            HistoryService.push(app.input.val());
                            app.updated();
                            //app.search("cmd:" + app.input.val());
                            app.handleEnterPress(app.input.val());                            
                        } else {
                            app.onResultClick();
                        }
                        break;

            default:    // make search with default search engine
                        //app.toggle(false);
                        //HistoryService.updated = true;
                        

                        /** trigger keydownhook */
                        app.handleKeyDownHook($.trim(app.input.val()));
                        
                        if(timeoutHandler) {
                            window.clearTimeout(timeoutHandler);
                        }
                        timeoutHandler = setTimeout(function() {
                            app.handleSearchHook($.trim(app.input.val()));
                        }, debounceTime);
        }
    });
};

app.updated = function() {
    app.toggle(false);
    HistoryService.updated = true;
};

/** 
    @TODO
    -   Moves eratically on selecting results on mouse key up and down
**/
app.handleScroll = function(top) {
    if(selectedResult == null) {
        app.parent.animate({
            scrollTop: 0
        }, 200);
        return;
    };

    var selected_top = selectedResult.offset().top - $( document ).scrollTop();
    var selected_bottom = selected_top + selectedResult.height() + 20;
    var ul_height = app.parent.height();
    var ul_scrollTop = app.parent.scrollTop();

    console.log(selected_top, selected_bottom, ul_height, ul_scrollTop, selected_bottom - ul_height);

    if(selected_bottom > ul_height || selected_top < ul_scrollTop ) {
        app.parent.animate({
            scrollTop: parseInt(selected_bottom)
        }, 200);
    }
};

module.exports = app;