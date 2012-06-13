App = App || {};
App.Settings = {
    baseURL: '/',
	dateFormat: 'd M, yy',
	errorReportingUrl: '/error.php',
	ajaxErrorMessageKey: 'rawMessage',
	Debug: {
	    enabled: true,
	    errorUrl: '',
	},
	UI: {
		Initial: {
			Dialog: {
				width: 400,
				height: 300,
				show: "fade",
				hide: "fade",
				autoOpen: false,
				buttons: {
				    "Close": function() {
				        $(this).dialog('close');
				    }
				}
			},
			Tabs: {},
			Slider: {
			    min: 0,
			    max: 10,
			    step: 1,
			    animate: true
			},
			Progressbar: {},
			DatePicker: {
				dateFormat: 'd M, yy'
			},
			Input: { //http://www.examplet.buss.hk/jquery/format.php
				Numeric: {
					precision: 4,
					autofix: true
				},
				Time: { //http://digitalbush.com/projects/masked-input-plugin/
				    format: "99:99",
				    placeholder: "_"
				}
			}
		},
		ajaxResponders: {
		    startLoading: function() {
		        $('body').append('<div id="loader">Loading...</div>');
		    },
		    errorOccured: function(jqXHR, textStatus, errorThrown) {
		        console.log('Ajax error: ');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
		    },
		    success: function() {
		        $('body #loader').remove();
		    }
		}
	}
}
