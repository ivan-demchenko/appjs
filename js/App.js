App = {};

/**
 * Autoload Modules
 */
var _appParts = ['Settings', 'EventManager', 'Ui', 'Inspector', 'Storage'];

$script.path('/js/App/');
$script(['Settings', 'EventManager', 'Ui', 'Inspector', 'Storage']);
$script.ready('Settings', function(){
    $script.ready('EventManager', function(){
        $script.ready('Ui', function(){
            $script.ready('Inspector', function(){
                $script.ready('Storage', function(){
                    $script.path('/js/App/Modules/');
                });
            });
        });
    });
});

App.Modules = (function(loader, $) {

    var _collection = new Array,

        _getModule = function(moduleName, params, callback) {
            if(_collection[moduleName]) {
                if(typeof callback=='function') {
                    callback();
                }
                return _collection[moduleName];
            }
            loader(moduleName, moduleName);
            loader.ready(moduleName, function(){
                _collection[moduleName].init.apply(params);
                if(typeof callback=='function') {
                    callback();
                }
            });
        },

        _registerModule = function(moduleName, obj) {
            console.info('Registered module `'+moduleName+'`');
            _collection[moduleName] = obj;
        },

        _getRunningModules = function(){
            return _collection;
        };

    return {
        Register: _registerModule,
        List: _getRunningModules,
        Get: _getModule
    }
}($script, jQuery));

/**
 * Help functions
 */
if (!window.console) {
  window.console = (function(console){
    for (var i = 0, a = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'], l = a.length, noop = function(){}; i < l; i += 1)
    console[a[i]] = noop;
    return console;
  })({});
}

var debugLog = function(msg, url, line) {
    console.warn(msg + '; url: ' + (url || '') + (line === undefined ? '' : ' on line: '+ line));
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