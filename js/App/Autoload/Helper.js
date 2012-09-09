(function (App, $, undefined) {
	'use strict';

	function noop() {};
	
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
	String.prototype.supplant = function (o) {
	    return this.replace(/{([^{}]*)}/g,
	        function (a, b) {
	            var r = o[b];
	            return typeof r === 'string' || typeof r === 'number' ? r : a;
	        }
	    );
	};

	if (!window.console) {
		window.console = (function (console) {
			for (var i = 0, a = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'], l = a.length; i < l; i += 1)
				console[a[i]] = noop;
			return console;
		})({});
	}
	
	App.Utils.debugLog = function debugLog (msg, url, line) {
		if (App.Settings.Debug.enabled) {
			console.warn(msg + '; url: ' + (url || '') + (line === undefined ? '' : ' on line: ' + line));
		}
		if (App.Settings.Debug.sendReports) {
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
		App.Utils.debugLog(msg, url, line);
		return true;
	};

	App.Utils.stringify = function stringify(obj) {
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
})(App, jQuery);