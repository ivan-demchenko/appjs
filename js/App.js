var App = (function ($) {
	'use strict';

	var
	autoloadScheme = ['Helper', 'KeyboardEventHandler', 'Tips'],
	appParts = ['Settings', 'ModuleRouting', 'UISettings', 'EventManager', 'UILibrary', 'UIBuilder', 'Inspector', 'Storage'],
	appIsBuilt = false,
	appPartsLocation = '/js/App/';

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
	function LoaderFactory(collection) {
		return function (path) { // = SubFolder/module
			var slices = path.split('/'),
				name = slices[slices.length - 1], // = module
				protocol = window.location.protocol,
				domain = window.location.host;
			
			if (collection[name]) return collection[name];

			var d = $.Deferred(),
				modulePath = protocol + '//' + domain + App.Settings.modulesLocation + path + '/' + name + '.js';
			$.when($.getScript(modulePath)).done(function (module, params) {
				if(App.Modules.Get(name).hasOwnProperty('init')) {
					App.Modules.Get(name).init.apply(App.Modules.Get(name), [params[0]]);
				}
				d.resolve();
			}).fail(function () {
				if (App.Settings.Debug.enabled) {
					console.error('Error loading module ' + name);
				}
				d.reject();
			});
			return d.promise();
		};
	};

	/**
	 * Module Manager
	 * 
	 * This is an object that manipulates with objects
	 * 
	 * @return object
	 */
	function ModuleManager() {
		var runningModules = [],
		factory = LoaderFactory(runningModules);

		return {
			Get : factory,

			Register : function (moduleName, obj) {
				App.Debug('Registered module `' + moduleName + '`');
				runningModules[moduleName] = obj;
			},

			RunningModules : function () {
				return runningModules;
			},

			LoadModulesByScheme : function () {
				var list = App.Settings.ModulesRouteScheme,
				loc = window.location.pathname;
				for (var i = 0; i < list[loc].length; i++) {
					factory(list[loc][i]);
				}
			}
		}
	};

	function AutoloadModules() {
		var list = autoloadScheme;
		for (var i = 0; i < list.length; i++)
			$.getScript('/js/App/Autoload/' + list[i] + '.js');
	};

	function prepareApp(i) {
		$.getScript(appPartsLocation + appParts[i] + '.js')
		 .done(function () {
			if (i < appParts.length - 1) {
				prepareApp(++i);
			} else {
				appIsBuilt = true;
				App.Modules.LoadModulesByScheme();
			}
		})
		.fail(function () {
			App.Debug('Error: ' + appPartsLocation + appParts[i] + '.js', 'error');
		});
	};
	
	function AppBuilder() {
		AutoloadModules();
		var i = 0;
		if (appIsBuilt === false) {
			prepareApp(i);
		} else {
			return false;
		}
	}

	return {
		Debug : function() {
			if(arguments.length == 1) {
				if (App.Settings.Debug.enabled) {
					console.info(arguments[0]);
				}
			}
			if(arguments.length == 2) {
				if (App.Settings.Debug.enabled) {
					console[arguments[1]](arguments[0]);
				}
			}
		},
		Build : AppBuilder,
		UI : {},
		Utils : {},
		Modules : new ModuleManager()
	};
})(jQuery);

/**
 * Build App with Internal Modules
 */
App.Build();