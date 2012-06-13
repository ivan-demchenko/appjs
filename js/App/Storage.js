App = App || {};

App.Storage = (function($){
    'use strict';
    
    var _cache = new Array(),
    	_successCallback = null,
    	_useCache = false,
    	_cleanUpCache = false,

    	_ajaxParams = {
    		url: '',
    		type: 'POST',
    		data: {},
    		dataType: 'json',
    		beforeSend: function() {
    			App.EM.trig('ajax.beforeSend');
    		},
    		error: function(jqXHR, textStatus, errorThrown) {
    			App.EM.trig('ajax.error: '+this.url, [jqXHR, textStatus, errorThrown]);
    		},
    		success: function(response) {
    		    App.EM.trig('ajax.success');
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
    	
	/*
	 * Ajax Processor
	 * ---------------------------------
	 */
	ajaxProcessor = {
		Url: function(url) {
	    	_ajaxParams.url = url;
	    	return this;
		},
		Type: function(type) {
			_ajaxParams.type = type
			return this;
		},
		Data: function(data) {
	    	_ajaxParams.data = data;
	    	return this;
	    },
	    DataType: function(dataType) {
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
	    Go: function(callback) {
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
	    }
	},
	
	/*
	 * LocalStorage Processor
	 * ---------------------------------
	 */	
	localProcessor = {
		setValue: function() {
			
		},
		getValue: function() {
			
		}
	},
	
	/*
     * SessionStorage Processor
     * ---------------------------------
     */ 
    sessionStorageProcessor = {
        setValue: function() {
            
        },
        getValue: function() {
            
        }
    }
	
    /*
     * Storage public interface
     * ---------------------------------
     */
    return {
    	Ajax: ajaxProcessor,
    	LS: localProcessor,
    	SS: sessionStorageProcessor,
    	getCache: function() {
    	    return _cache;
    	}
    }

}(jQuery))