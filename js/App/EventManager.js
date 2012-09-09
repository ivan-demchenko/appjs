(function ($) {
	'use strict';
	/**
	 * Event Object
	 * --------------------------------------------------------------
	 */
	Event = function () {
		this._observers = [];
	}

	Event.prototype = {
		raise : function (data) {
			for (var i in this._observers) {
				var item = this._observers[i];
				setTimeout(function () { item.observer.call(item.context, data); }, 0);
			}
		},

		subscribe : function (observer, context) {
			var ctx = context || null;
			this._observers.push({
				observer : observer,
				context : ctx
			});
		},

		unsubscribe : function (observer, context) {
			for (var i in this._observers)
				if (this._observers[i].observer == observer && this._observers[i].context == context)
					delete this._observers[i];
		}
	};
	
	/**
	 * Event Manager's body
	 * --------------------------------------------------------------
	 */
	var modulesCache = App.Modules.RunningModules(),
		_eventsArray = new Array;

	function _bindEvent(eventName, callbackFunction, context)
	{
		App.Debug('Event Binded: ' + eventName + ', with responder: ' + callbackFunction);

		var evt, ename = eventName.split(':')[1];
		if (_eventsArray[ename] === undefined) {
			_eventsArray[ename] = new Event();
		}
		evt = _eventsArray[ename];
		evt.subscribe(callbackFunction, context);

		return this;
	};

	function _unbindEvent(eventName, callbackFunction, context)
	{
		if (_eventsArray[eventName] !== undefined) {
			_eventsArray[eventName].unsubscribe(callbackFunction, context);
		}
		return this;
	};

	function _triggerEvent(eventName, eventData)
	{
		App.Debug('Event Trigged: ' + eventName + ', with event data: ' + (eventData == undefined ? 'no data' : eventData));

		if (_eventsArray[eventName] !== undefined) {
			_eventsArray[eventName].raise(eventData);
		}

		return this;
	};

	function _getRespondersByEventName(eventName)
	{
		for (var i in _eventsArray[eventName]._observers) {
			var item = _eventsArray[eventName]._observers[i];
			return item.observer.toString();
		}
	};
	
	/**
	 * Event Manager's public interface
	 * --------------------------------------------------------------
	 */
	App.EM = {
		bind : _bindEvent,
		unbind : _unbindEvent,
		trig : _triggerEvent,
		eventResponders : _getRespondersByEventName
	}

})(jQuery);