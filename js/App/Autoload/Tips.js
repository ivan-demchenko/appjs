/**
 * Tips and Hintings Module
 */
(function($, exports){
	'use strict';

	var x = null,
		text = '',
		target = null,
		visible = false;

	function showHint(text) {
		visible = true;
		x.html(text).stop(true, true).fadeTo(222, 0.8);
	}

	function hideHint() {
		target = null;
		visible = false;
		x.fadeOut(222);
	}

	function init() {
		x = $(document.createElement('div'));
		x.attr('id', 'hint').appendTo('body');

        $('#hint').hide();

		$('a[title]').mouseenter(function(e){
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.cancelBubble = true;
			text = $(this).attr('title');
			$(this).attr('title', '');
			showHint(text);
		}).mouseleave(function(e) {
			hideHint();
			$(this).attr('title', text);
		});

		$(document).mousemove(function(e) {
			if(visible)
				x.css('left', e.pageX+5 + 'px').css('top', e.pageY+5 + 'px');
		});
	}

	$(document).ready(function(){
		init();
	});

})(jQuery, App.Modules);