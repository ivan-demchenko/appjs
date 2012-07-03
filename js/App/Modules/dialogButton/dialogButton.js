(function ($) {
	'use strict';
	var
	params = {},
	bindEventListeners = function () {
		$('#create-item').click(function () {
			App.EM.trig('SubFolder/workDialog:openDialog');
		});
	},
	
	dialogButton = {
		init : function (moduleParams) {
			params = moduleParams;
			bindEventListeners();
		}
	}
	
	App.Modules.Register('dialogButton', dialogButton);
}(jQuery));