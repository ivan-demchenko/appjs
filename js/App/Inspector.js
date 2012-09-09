(function(App, $, undefined){
	App.UI.Collection = {};

	$(document).ready(function () {
		_inspectScope();
	});
	/*
	 * DOM Responders
	 * ----------------------------------------------------------
	 */

	/**
	 * Use this when you have inserted new element and want to inspect only it:
	 * Pass ID of element in array.
	 *
	 * <div class="dialog" id="my-dialog"></div>
	 *
	 * App.EM.trig('UI:new', '#my-dialog');
	 */
	App.EM.bind("UI:NewHtmlElement", _inspectElement);

	/**
	 * Use this when you just injected a piece of HTML with different UI element
	 * and wanna inspect main element and all everyone inside of it.
	 *
	 * <div class="tabs" id="my-tabs">
	 * 	<div class="slider" id="myslider"></div>
	 *  <input type="text" class="datePicker" id="my-dp">
	 * </div>
	 *
	 * App.EM.trig('UI:injected', {type: 'dialog', scope: '#id'});
	 */
	App.EM.bind("UI:HtmlInjected", function (data) {
		var scope = '#'+data.element['0'].id + ' ';
		_inspectElement(data.element['0']);
		_inspectScope(scope);
	});

	/*
	 * Scope Inspector
	 * ----------------------------------------------------------
	 */
	function _inspectScope(scope) {
		if (!scope)
			scope = 'body ';

		$.each(App.UI.Settings.KnownElements, function (idx, elemClass) {
			$(scope + '.' + elemClass).each(function (i) {
				_inspectElement($(this));
			});
		});

		return this;
	}

	function _inspectElement(element, params) {
		var elementType = '';
		// Determine which element we got
		$.each(App.UI.Settings.KnownElements, function (idx, elemClass) {
			if ($(element).hasClass(elemClass)) {
				elementType = elemClass;
			}
		});
		if (!App.UI.Collection.hasOwnProperty(elementType)) {
			App.UI.Collection[elementType] = [];
		}
		if (typeof App.UI.Collection[elementType][$(element).attr('id')] === 'undefined') {
			App.UI.Collection[elementType][$(element).attr('id')] = App.UI.Builder.buildElement(elementType, $(element), params);
		}
	}

	App.Inspector = {
		reinspect : _inspectScope
	}
})(App, jQuery);