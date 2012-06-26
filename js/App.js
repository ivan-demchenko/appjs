var App = (function ($) {
	'use strict';
    var
        appParts = ['Settings', 'EventManager', 'Ui', 'Inspector', 'Storage'],
        appIsBuilt = false,
        appPartsLocation = '/js/App/',
        modulesLocation = '/js/App/Modules/',
        modulesCollection = {},

        LoaderFactory = function (collection) {
            return function(name) {
                if(collection[name])
                    return collection[name];
                
                var dfd = $.Deferred(),
                    modulePath = modulesLocation + moduleName + '/' + moduleName + '.js',
                    moduleParams = modulesLocation + moduleName + '/params.json';
                
                $.when($.getScript(modulePath), $.getJSON(moduleParams))
                .done(function (aScript, aJSON) {
                    modulesCollection[moduleName].module.init.apply(initParams);
                    console.log(aScript);
                    console.log(aJSON);
                    dfd.resolve();
                });
                return dfd.promise();
            };
        },
        
        ModuleManager = {
            Modules: modulesCollection,
            Get: LoaderFactory(modulesCollection),
            Register: function (moduleName, obj) {
                if(App.Settings.Debug.enabled)
                    console.info('Registered module `' + moduleName + '`');
                modulesCollection[moduleName] = {module: obj, params: {}};
            },
            LoadModulesByScheme: function () {
                var list = App.Settings.ModulesScheme(),
                    loc = window.location.pathname;

                $.each(list[loc], function (i, val) {
                    LoaderFactory (val);
                });
            }
        },

        loadAppPart = function (i)
        {
            $.getScript(appPartsLocation + appParts[i] + '.js')
            .done(function () {
                if(i < appParts.length-1)
                    loadAppPart(++i);
                else {
                    App.Modules.LoadModulesByScheme();
                    appIsBuilt = true;
                }
            })
            .fail(function () {
                console.warn('Error: ' + appPartsLocation + appParts[i] + '.js');
            });
        }
    
    ;return {
        Build: function (i) {
            if(appIsBuilt === false)
                loadAppPart (i);
            else return false;
        },
        Modules: ModuleManager
    };
}(jQuery));

/**
 * Build App with Internal Modules
 */
var i = 0;
App.Build(i);

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