App = {
	Modules: {}
};

$(document).ready(function(){
    $.each(App.Modules, function(i, module){
        if(module.hasOwnProperty('autoInit')) {
           module.autoInit();
        }
    });
});

if (!window.console) {
  window.console = (function(console){
    for (var i = 0, a = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'], l = a.length, noop = function(){}; i < l; i += 1)
    console[a[i]] = noop;
    return console;
  })({});
}

var debugLog = function(msg, url, line) {
    console.warn(msg + '; url: ' + (url || '') + (line === undefined ? '' : ' (line: ' +  line + ')'));
    if (!App.Settings.Debug) return;
    var errorData = {
        msg: msg,
        url: url,
        line: line,
        location: document.location.href
    }
    $.post(App.Settings.errorReportingUrl, errorData);
};

window.onerror = function(msg, url, line){
    debugLog(msg, url, line);
    return true;
};

function stringify(obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (obj.hasOwnProperty(n)) {
                if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}