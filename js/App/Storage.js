App = App || {};

App.Storage = (function($){
    'use strict';

    if(App.Settings.Debug.enabled) {
        if (window.addEventListener) {
            window.addEventListener("storage", _handleLocalStorage, false);
        } else {
            window.attachEvent("onstorage", _handleLocalStorage);
        };
    }

    var _cache = new Array(),
    	_successCallback = null,
    	_useCache = false,
    	_isSilentAjax = false,
    	_cleanUpCache = false,

    	_ajaxParams = {
    		url: '',
    		type: 'POST',
    		data: {},
    		dataType: 'json',
    		beforeSend: function() {
    			App.EM.trig('Storage.Ajax.beforeSend');
    		},
    		error: function(jqXHR, textStatus, errorThrown) {
    			App.EM.trig('Storage.Ajax.error: '+this.url, [jqXHR, textStatus, errorThrown]);
    		},
    		success: function(response) {
    		    App.EM.trig('Storage.Ajax.success');
    			var _data = null;
                try {
                    _data = $.parseJSON(response);
                    if(typeof _data == 'object') {
                        if(_data.error) {
                            alert(_data[App.Settings.ajaxErrorMessageKey]);
                            return false;
                        }
                    }
                } catch(e) {
                    _data = response;
                }
                _cache[_ajaxParams.url] = _data;
    			if(typeof _successCallback == 'function') {
    				_successCallback(_data);
    			}
    		}
	    },
	    
	    _handleLocalStorage = function(e) {
	        if (!e) {
	            e = window.event;
	        }
	        console.log('LocalStorage event: key: '+e.key+' old value: '+e.oldValue+', new value: '+e.newValue+', url: '+e.url+', ');
	    },
	    
	    _produceAjaxRequest = function(callback) {
	        if(typeof callback == 'function') {
                _successCallback = callback;
            }
            if(_useCache) {
                if(_cache[_ajaxParams.url] != undefined) {
                    if(typeof _successCallback == 'function') {
                        _successCallback(_cache[_ajaxParams.url]);
                        return true;
                    }
                }
            }
            return $.ajax(_ajaxParams);
	    },
    	
	/*
	 * Ajax Processor
	 * ---------------------------------
	 */
	ajaxProcessor = {
		Data: function(data) {
	    	_ajaxParams.data = data;
	    	return this;
	    },
	    ResponseType: function(dataType) {
	    	_ajaxParams.dataType = dataType;
	    	return this;
	    },
	    ExtraParams: function(params) {
	        $.extend(_ajaxParams, params);
	        return this;
	    },
	    UseCache: function(val) {
	        _useCache = val;
	        return this;
	    },
	    /**
	     * arguments[0] = url,
	     * arguments[1] = callback/silent
	     * arguments[2] = callback
	     */
	    Post: function() {
	        _ajaxParams.url = arguments[0];
	        _ajaxParams.type = 'POST';
	        // Only callback
	        if(arguments.length == 2) {
	           _isSilentAjax = false;
               _produceAjaxRequest(arguments[1]);
            }
            // Callback and silent mode switcher
	        if(arguments.length == 3) {
	           _isSilentAjax = arguments[1];
	           _produceAjaxRequest(arguments[2]);
	        }
	        return this;
	    },
	    Get: function() {
            _ajaxParams.url = arguments[0];
            _ajaxParams.type = 'GET';
            // Only callback
            if(arguments.length == 2) {
               _isSilentAjax = false;
               _produceAjaxRequest(arguments[1]);
            }
            // Callback and silent mode switcher
            if(arguments.length == 3) {
               _isSilentAjax = arguments[1];
               _produceAjaxRequest(arguments[2]);
            }
            return this;
        },
        GetCache: function() {
            return _cache;
        },
        DropCache: function() {
            _cache = new Array();
            return this;
        }
	},
	
	/*
	 * LocalStorage Processor
	 * ---------------------------------
	 */
	localProcessor = {
		Set: function(key, val) {
            if(typeof localStorage == 'undefined') {
                throw 'Browser do not support `localStorage`';
            }
            localStorage.setItem(key, val);
        },
        Get: function(key) {
            if(typeof localStorage == 'undefined') {
                throw 'Browser do not support `localStorage`';
            }
            return localStorage.getItem(key);
        },
        DropVal: function(key) {
            if(typeof localStorage == 'undefined') {
                throw 'Browser do not support `localStorage`';
            }
            localStorage.removeItem(key);
        },
        Clear: function() {
            localStorage.clear();
        }
	},
	
	/*
     * SessionStorage Processor
     * ---------------------------------
     */ 
    sessionStorageProcessor = {
        Set: function(key, val) {
            if(typeof sessionStorage == 'undefined') {
                throw 'Browser do not support `sessionStorage`';
            }
            sessionStorage.setItem(key, val);
        },
        Get: function(key) {
            if(typeof sessionStorage == 'undefined') {
                throw 'Browser do not support `sessionStorage`';
            }
            return localStorage.getItem(key);
        },
        DropVal: function(key) {
            if(typeof sessionStorage == 'undefined') {
                throw 'Browser do not support `sessionStorage`';
            }
            sessionStorage.removeItem(key);
        },
        Clear: function() {
            sessionStorage.clear();
        }
    }
	
    /*
     * Storage public interface
     * ---------------------------------
     */
    return {
    	Ajax: ajaxProcessor,
    	Local: localProcessor,
    	Session: sessionStorageProcessor
    }

}(jQuery))