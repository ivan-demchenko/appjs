var App = (function ($) {
	'use strict';
	
	var
	appParts = ['Settings', 'UISettings', 'EventManager', 'UILibrary', 'UIBuilder', 'Inspector', 'Storage'],
	appIsBuilt = false,
	appPartsLocation = '/js/App/',
	
	/**
	 * Module loader
	 * 
	 * Modules are placed in js/App/Modules directory. Each module can also be placed in subfolder.
	 * So, path to module could be `js/App/Modules/module/module.js` or `js/App/Modules/dir/subdir/submodule/submodule.js`
	 * 
	 * Module consists of JS file and JSON file. JS file consists of business logic. JSON file consits of parameters.
	 * 
	 * JS file must contain `init` function that will accept an object with params from JSON file.
	 * 
	 * @return function
	 */
	LoaderFactory = function (collection) {
		return function (path) { // = SubFolder/module
			var slices = path.split('/'),
			name = slices[slices.length - 1]; // = module
			
			if (collection[name]) {
				return collection[name];
			}
			
			var d = $.Deferred(),
			modulePath = App.Settings.modulesLocation + path + '/' + name + '.js',
			moduleParams = App.Settings.modulesLocation + path + '/params.json';
			
			$.when($.getScript(modulePath), $.getJSON(moduleParams)).done(function (module, params) {
				App.Modules.Get(name).init.apply(App.Modules.Get(name), [params[0]]);
				d.resolve();
			}).fail(function () {
				if (App.Settings.Debug.enabled) {
					console.error('Error loading module ' + name);
				}
				d.reject();
			});
			return d.promise();
		};
	},
	
	/**
	 * Module Manager
	 * 
	 * This is an object that manipulates with objects
	 * 
	 * @return object
	 */
	ModuleManager = function () {
		var runningModules = [],
		factory = LoaderFactory(runningModules);
		
		return {
			Get : factory,
			
			Register : function (moduleName, obj) {
				if (App.Settings.Debug.enabled) {
					console.info('Registered module `' + moduleName + '`');
				}
				runningModules[moduleName] = obj;
			},
			
			RunningModules : function () {
				return runningModules;
			},
			
			LoadModulesByScheme : function () {
				var list = App.Settings.GetModulesScheme(),
				loc = window.location.pathname;
				
				for (var i = 0; i < list[loc].length; i++) {
					factory(list[loc][i]);
				}
			}
		}
	},
	
	prepareApp = function (i) {
		$.getScript(appPartsLocation + appParts[i] + '.js')
		.done(function () {
			if (i < appParts.length - 1) {
				prepareApp(++i);
			} else {
				App.Modules.LoadModulesByScheme();
				appIsBuilt = true;
			}
		})
		.fail(function () {
			console.error('Error: ' + appPartsLocation + appParts[i] + '.js');
		});
	};

	return {
		Build : function (i) {
			if (appIsBuilt === false) {
				prepareApp(i);
			} else {
				return false;
			}
		},
		UI : {},
		Modules : new ModuleManager()
	};
})(jQuery);

/**
 * Build App with Internal Modules
 */
var i = 0;
App.Build(i);

/**
 * Very usefull function to create templates
 * Borrowed from Douglas Crockford.
 * 
 * Ussage is very simple. Imagine, you have an object
 * 
 * var data = {
 *	  title: 'C pocket reference',
 *	  type: 'PDF Document',
 *	  tag: 'programming',
 *	}
 * 
 * and you wanna make a template from this. Then you just write such code:
 * var html = "<tr> <td>{title}</td> <td>{type}</td> <td><a href="/tag/{tag}">{tag}</a></td> </tr>".supplant(data);
 */
String.prototype.supplant = function(o) {
    return this.replace(/{([^{}]*)}/g,
        function(a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

/**
 * Help functions
 */
function noop(){};

if (!window.console) {
	window.console = (function (console) {
		for (var i = 0, a = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'], l = a.length, noop = function () {}; i < l; i += 1)
			console[a[i]] = noop;
		return console;
	})({});
}

var debugLog = function (msg, url, line) {
	console.warn(msg + '; url: ' + (url || '') + (line === undefined ? '' : ' on line: ' + line));
	if (App.Settings.Debug.enabled && App.Settings.Debug.sendReports) {
		var errorData = {
			msg : msg,
			url : url,
			line : line,
			location : document.location.href
		}
		$.post(App.Settings.errorReportingUrl, errorData);
	}
};

window.onerror = function (msg, url, line) {
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
                if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = v;
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};