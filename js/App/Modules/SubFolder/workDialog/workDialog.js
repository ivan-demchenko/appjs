(function($){
    'use strict';

    var 
        _dialogElementID = 'some-dialog',
    	_dialogElement = null,

    	_methods = {
        	loadDialogForm: function()
        	{
    	    	App.Storage.Ajax.UseCache(true).ResponseType('html').Get('/content/dialog.html', function(data){
    	    		App.Collection.Dialogs[_dialogElementID].SetTitle('Create New Item').SetContent(data).Modal().Show();
                    App.EM.trig('UI:injected', {type:'dialog', scope:'#'+_dialogElementID});
                    App.Collection.Inputs['city-name'].setDataSourse(_parseCityNames);
    	    	});
    	    },
    	    
    	    saveItem: function()
    	    {
    	    	console.log('Item saved');
    	    }
        },

        /**
         * Initialize evets listeners for this module
         */
        _initEventsListeners = function()
        {
        	App.EM.bind('workDialog:openDialog', _methods.loadDialogForm, this);
        	App.EM.bind('workDialog:save', _methods.saveItem, this);
        },

        _parseCityNames = function(request, response)
        {
            App.Storage.Ajax
                .UseCache(false)
                .Data({featureClass: "P", style: "full", name_startsWith: request.term })
                .ResponseType("jsonp")
                .Get("http://ws.geonames.org/searchJSON", function(data) {
                    response( $.map( data.geonames, function( item ) {
                        return {
                            label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                            value: item.name
                        }
                    }));
                });
        },

        /**
         * Create HTML snippets and append them to Default App Scope 
         */
        _initMarkup = function()
        {
        	if(_dialogElement === null) {
        		if( $('#'+_dialogElementID).length > 0 ) {
        			_dialogElement = $('#'+_dialogElementID);
        		} else {
        			_dialogElementID = $('<div class="dialog" id="'+_dialogElementID+'"></div>');
        			App.Settings.defaultScope.append(_dialogElementID);
        		}
        	}
        },
    
        /**
         * Initialize UI elements handlers that perpesent
         * bussiness logic, comfort or some other features.
         */
        _initElementsHandlers = function() {
        },
    
        /**
         * Bootstrap of module 
         */
        _initialize = function() {
        	_initMarkup();
        	_initEventsListeners();
        };
	
    	/**
    	 * Public interface of a Module 
    	 */
        var workDialog = {
            init: _initialize
        };

App.Modules.Register('workDialog', workDialog);    
})(jQuery);