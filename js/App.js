var App = (function ($) {
	'use strict';
	
	function LoaderFactory (collection) {
		return function(name) {
		    if(collection[name]) {
		        return collection[name];
		    }

		    var 
    		    d = $.Deferred(),
                modulePath = App.Settings.modulesLocation + name + '/' + name + '.js',
		        moduleParams = App.Settings.modulesLocation + name + '/params.json';
            $.when($.getScript(modulePath), $.getJSON(moduleParams))
            .done(function(dialog, params){
    	       App.Modules.Get(name).init.apply(App.Modules.Get(name), [params[0]]);
    	       d.resolve();
            })
            .fail(function(){
                if(App.Settings.Debug.enabled) {
                    console.warn('Error loading module ' + name);
                }
                d.reject();
            });
            return d.promise();
	    };
	};
	
	var
        appParts = ['Settings', 'EventManager', 'Ui', 'Inspector', 'Storage'],
        appIsBuilt = false,
        appPartsLocation = '/js/App/',

		/**
		 * Module Manager 
		 */
		ModuleManager = function () {
			var runningModules = [],
				factory = LoaderFactory(runningModules);
				
			return {
				Get: factory,
				Register: function (moduleName, obj)
				{
			        if(App.Settings.Debug.enabled)
			            console.info('Registered module `' + moduleName + '`');
			        runningModules[moduleName] = obj;
				},
				RinningModules: function() {
				    return runningModules;
				},
				LoadModulesByScheme: function ()
				{
			        var list = App.Settings.GetModulesScheme(),
			            loc = window.location.pathname;
			
			        for(var i = 0; i < list[loc].length; i++) {
			        	factory(list[loc][i]);
			        }
				}
			}
		},
		
        prepareApp = function (i)
        {
            $.getScript(appPartsLocation + appParts[i] + '.js')
            .done(function () {
                if(i < appParts.length - 1)
                    prepareApp(++i);
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
        Build: function(i) {
            if(appIsBuilt === false)
                prepareApp(i);
            else return false;
        },
        Modules: new ModuleManager()
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
    if (App.Settings.Debug.enabled && App.Settings.Debug.sendReports) {
	    var errorData = {
	        msg: msg,
	        url: url,
	        line: line,
	        location: document.location.href
	    }
	    $.post(App.Settings.errorReportingUrl, errorData);
    }
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