App.Modules.BusinessModule = (function($){
    'use strict';

    var 
        _dialogElementID = 'some-dialog',
    	_dialogElement = null,

    	_methods = {
        	loadDialogForm: function() {
    	    	App.Storage.Ajax.Url('/content/dialog.html').UseCache(true).Type('GET').DataType('html').Go(function(data){
    	    		App.Collection.Dialogs[_dialogElementID].SetTitle('Create New Item').SetContent(data).Modal().Show();
                    App.EM.trig('ui.element.injected', {type:'dialog', scope:'#'+_dialogElementID});
                    App.Collection.Inputs['city-name'].setDataSourse(_parseCityNames);
    	    	});
    	    },
    	    saveItem: function() {
    	    	console.log('Item saved');
    	    }
        };

    /**
     * Initialize evets listeners for this module
     */
    function _initEventsListeners() {
    	App.EM.bind('BusinessModule.openDialog', _methods.loadDialogForm, this);
    	App.EM.bind('BusinessModule.save', _methods.saveItem, this);
    }

    function _parseCityNames(request, response) {
        App.Storage.Ajax
            .Url("http://ws.geonames.org/searchJSON")
            .UseCache(false)
            .DataType("jsonp")
            .Data({featureClass: "P", style: "full", name_startsWith: request.term })
            .Go(function(data) {
                response( $.map( data.geonames, function( item ) {
                    return {
                        label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                        value: item.name
                    }
                }));
            });
    }

    /**
     * Create HTML snippets and append them to Default App Scope 
     */
    function _initMarkup()
    {
    	if(_dialogElement === null) {
    		if( $('#'+_dialogElementID).length > 0 ) {
    			_dialogElement = $('#'+_dialogElementID);
    		} else {
    			_dialogElementID = $('<div class="dialog" id="'+_dialogElementID+'"></div>');
    			App.Settings.defaultScope.append(_dialogElementID);
    		}
    	}
    }
    
    /**
     * Initialize UI elements handlers that perpesent
     * bussiness logic, comfort or some other features.
     */
    function _initElementsHandlers() {
    }
    
    /**
     * Bootstrap of module 
     */
    function _initialize() {
    	_initMarkup();
    	_initEventsListeners();
    }
	
	/**
	 * Public interface of a Module 
	 */
    return {
        init: _initialize
    }
    
})(jQuery);