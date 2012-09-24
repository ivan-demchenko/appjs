(function (App, $) {
	'use strict';

	if (App.Settings.Debug.enabled) {
		if (window.addEventListener) {
			window.addEventListener("storage", _handleLocalStorage, false);
		} else {
			window.attachEvent("onstorage", _handleLocalStorage);
		};
	}

	if ($('#error-dialog').length === 0) {
		var ed = document.createElement('div');
		$(ed).addClass('dialog').attr('id', 'error-dialog').attr('title', 'Server Error').css({
			width : '600px',
			height : '470px',
			display : 'none'
		}).appendTo('body');
		App.EM.trig('NewHtmlElement', '#error-dialog');
	}

	var _cache = [],
		_successCallback = null,
		_useCache = false,
		_isSilentAjax = false,
		_cleanUpCache = false,
		_ajaxParams = {
			url : '',
			type : 'POST',
			data : {},
			dataType : 'json',
			beforeSend : function () {
				App.Debug('Storage: Prepare to start AJAX request.');
				App.Settings.ajaxResponders.startLoading();
				if(_useCache && _cache[_ajaxParams.url]) {
					App.Debug('Storage: Data has been gotten from cache.');
					return _cache[_ajaxParams.url];
				}
			},
			error : function (jqXHR, textStatus, errorThrown) {
				App.Debug('Storage: AJAX request finished with error.');
				App.Settings.ajaxResponders.errorOccured(jqXHR, textStatus, errorThrown, this.url);
				_cache[_ajaxParams.url] = false;
				return false;
			},
			success : function (response) {
				App.Debug('Storage: AJAX request finished successfully.');
				App.Settings.ajaxResponders.success();
				if (App.Settings.ajaxResponders.errorRequestProcessor(response, this.dataType)) {
					if (_useCache) {
						if (typeof _cache[_ajaxParams.url] !== 'undefined') {
							_cache[_ajaxParams.url] = response;
						}
						if (typeof _successCallback === 'function') {
							_successCallback(_cache[_ajaxParams.url]);
							return true;
						}
					} else {
						_successCallback(response);
						return true;
					}
				} else {
					return false;
				}
			}
		},

	_handleLocalStorage = function (e) {
		if (!e) {
			e = window.event;
		}
		console.log('LocalStorage event: key: ' + e.key + ' old value: ' + e.oldValue + ', new value: ' + e.newValue + ', url: ' + e.url + ', ');
	},

	/*
	 * Ajax Processor
	 * ---------------------------------
	 */
	ajaxProcessor = {
		Data : function (data) {
			_ajaxParams.data = data;
			return this;
		},
		ResponseType : function (dataType) {
			_ajaxParams.dataType = dataType;
			return this;
		},
		ExtraParams : function (params) {
			$.extend(_ajaxParams, params);
			return this;
		},
		UseCache : function (val) {
			_useCache = val;
			return this;
		},
		/**
         * string           arguments[0] url,
         * boolean/function arguments[1] callback/silent
         * function         arguments[2] callback
         */
		requestProducer : function (method, args) {
		    _ajaxParams.type = method;
    		_ajaxParams.url = args[0];
            switch (args.length) {
                case 2 :
                    _isSilentAjax = false;
                    _successCallback = args[1];
                    break;
                case 3 :
                    _isSilentAjax = args[1];
                    _successCallback = args[2];
                    break;
            }
            return $.ajax(_ajaxParams);
		},
		Post : function POSTRequest () { this.requestProducer('POST', arguments) },
		Get : function GETRequest () { this.requestProducer('GET', arguments) },
		GetCache : function () {
			return _cache;
		},
		DropCache : function () {
			_cache = new Array();
			return this;
		}
	},

	/*
	 * LocalStorage Processor
	 * ---------------------------------
	 */
	localProcessor = {
		Set : function (key, val) {
			if (localStorage) {
				localStorage.setItem(key, val);
				return this;
			} else {
				throw 'Browser do not support `localStorage`';
			}
		},
		Get : function (key) {
			if (localStorage) {
				if (localStorage.length) {
					return localStorage.getItem(key);
				} else {
					throw 'No data for this domain';
				}
			} else {
				throw 'Browser do not support `localStorage`';
			}
		},
		DropVal : function (key) {
			if (localStorage) {
				localStorage.removeItem(key);
				return this;
			} else {
				throw 'Browser do not support `localStorage`';
			}
		},
		Clear : function () {
			if (localStorage) {
				localStorage.clear();
				return this;
			} else {
				throw 'Browser do not support `localStorage`';
			}
		}
	},

	/*
	 * SessionStorage Processor
	 * ---------------------------------
	 */
	sessionStorageProcessor = {
		Set : function (key, val) {
			if (sessionStorage) {
				sessionStorage.setItem(key, val);
				return this;
			} else {
				throw 'Browser do not support `sessionStorage`';
			}
		},
		Get : function (key) {
			if (sessionStorage) {
				if (sessionStorage.length) {
					return localStorage.getItem(key);
				} else {
					throw 'Your `sessionStorage` is empty';
				}
			} else {
				throw 'Browser do not support `sessionStorage`';
			}
		},
		DropVal : function (key) {
			if (sessionStorage) {
				sessionStorage.removeItem(key);
				return this;
			} else {
				throw 'Browser do not support `sessionStorage`';
			}
		},
		Clear : function () {
			if (sessionStorage) {
				sessionStorage.clear();
				return this;
			} else {
				throw 'Browser do not support `sessionStorage`';
			}
		}
	},

	/**
	 * WebSocket wrapper
	 */
	webSocketProcessor = {
		ws : [],
		init : function (alias, address, onMessage) {
			if ("WebSocket" in window) {
				if( typeof ws[alias] === 'undefined' ) {
					this.ws[alias] = new WebSocket('ws:' + address);
					this.ws[alias].onmessage = onMessage;
					this.ws[alias].onclose = function() {
						App.Debug('WebSocket is closed.');
						delete ws[alias];
				    };
				} else {
					if(App.Settings.Debug.enabled) {
						console.error('WebSocket with alias `' + alias + '` and address `' + address + '` is already opened.');
					}
				}
			}
		},
		send : function (alias, msg) {
			this.ws[alias].send(msg);
		}
	};

	/*
	 * Storage public interface
	 * ---------------------------------
	 */
	App.Storage = {
		Ajax : ajaxProcessor,
		Local : localProcessor,
		Session : sessionStorageProcessor,
		WS : webSocketProcessor
	};

	/*Object.prototype.SaveMe = function(url, key) {
		var self = this;
		App.Debug({key: self});
		App.Storage.Ajax.Data({key: self}).Post(url, function(response){
			App.EM.trig('Storage' + key + 'Saved', response);
		});
	};*/
})(App, jQuery);