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

	// Sorting Dates
	$.fn.dataTableExt.oSort['us_date-asc'] = function (a, b) {
        var x = new Date(a), y = new Date(b);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };

    $.fn.dataTableExt.oSort['us_date-desc'] = function (a, b) {
        var x = new Date(a), y = new Date(b);
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    };

    // Sorting numbers O_o
    $.fn.dataTableExt.oSort['numbers-asc'] = function (a, b) {
        var x = parseFloat(a.replace(/(<([^>]+)>)/ig, '').replace(/[^-.\d]+/g, '')),
        	y = parseFloat(b.replace(/(<([^>]+)>)/ig, '').replace(/[^-.\d]+/g, ''));
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };

    $.fn.dataTableExt.oSort['numbers-desc'] = function (a, b) {
        var x = parseFloat(a.replace(/(<([^>]+)>)/ig, '').replace(/[^-.\d]+/g, '')),
        	y = parseFloat(b.replace(/(<([^>]+)>)/ig, '').replace(/[^-.\d]+/g, ''));
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    };

	// Module registration
	// Public interface
	// ----------------------------------------------
	App.Modules.Register('Base', {});
})(App, jQuery);