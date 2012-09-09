/**
 * Keyboard events binder
 */
(function ($, exports) {
	'use strict';

	var binded = [];

	function bindKey(combination, callback)
	{
		var code = combination.toString().toLowerCase();
		binded[code] = callback;
		return App.Modules.KeyBinder;
	}

	function unBindKey(combination, key)
	{
		var code = combination.toString().toLowerCase();
		delete binded[code];
		return App.Modules.KeyBinder;
	}

	$(window).bind('keypress', function(e){
		var code;
		if(e.altKey) { code = 'alt+'; }
		if(e.ctrlKey) { code = 'ctrl+'; }
		if(e.shiftKey) { code = 'shift+'; }
		code += String.fromCharCode(e.charCode);

		if(typeof binded[code] == 'function') {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.cancelBubble = true;
			e.returnValue = false;
			e.keyCode = 0;

			binded[code](e);
			return false;
		}
	});

	exports.KeyBinder = {
		bind : bindKey,
		unbind : unBindKey
	}

})(jQuery, App.Utils);