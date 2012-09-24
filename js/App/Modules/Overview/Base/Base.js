(function (App, $) {
	'use strict';

	// For Firefox, in Chrome ALT+S will work
	App.Utils.KeyBinder.bind('ctrl+f', function(){
		$("#searchterm").focus();
	});

	var offsetTop = parseInt($(".header").css('height')) + parseInt($(".switcher").css('height')) + 14;
	$(window).scroll(function() {
		if( $(window).scrollTop() >= offsetTop ) {
			$("#overview-header").addClass('fixed-at-top');
			if( $("#header-placeholder").length == 0 ) {
				$("#overview-header").before('<div id="header-placeholder" style="height:'+$("#overview-header").css('height')+';width:100%;">&nbsp;</div');
			}
		} else {
			$("#overview-header").removeClass('fixed-at-top');
			$("#header-placeholder").remove();
		}
	});
	// Module registration
	// Public interface
	// ----------------------------------------------
	App.Modules.Register('Base', {});
})(App, jQuery);