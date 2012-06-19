App = App || {};
App.Settings = {
    baseURL: '/',
	dateFormat: 'd M, yy',
	Debug: {
	    enabled: true,
	    errorReportingUrl: '/error.php',
        ajaxErrorKey: 'error',
        ajaxErrorMessageKey: 'rawMessage',
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
			    animate: true
			},
			Progressbar: {},
			DatePicker: {
				firstDay: 0,
				dateFormat: 'd M, yy',
				showOn: "both",
				numberOfMonths: 1,
				dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				prevText: "Prev",
				nextText: "Next",
				closeText: "Done",
				currentText: "Today",
				hideIfNoPrevNext: true
			},
			Input: { //http://www.examplet.buss.hk/jquery/format.php
			    Autocomplete: {
			        source: []
                },
				Numeric: {
					precision: 2,
					autofix: true
				},
				Time: { //http://digitalbush.com/projects/masked-input-plugin/
				    format: "99:99",
				    placeholder: "_"
				},
				Masked: {
					format: "(999) 999-99-99",
				    placeholder: "_"
				}
			}
		}
	},
    ajaxResponders: {
        startLoading: function() {
            $('body').append('<div id="loader">Loading...</div>');
        },
        errorOccured: function(jqXHR, textStatus, errorThrown) {
            console.warn('Ajax error: ');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        errorRequestProcessor: function(response) {
            var data = null;
            try {
                data = $.parseJSON(response);
                if(App.Settings.Debug.enabled) {
                    var errKey = App.Settings.Debug.ajaxErrorKey,
                        errMsg = App.Settings.Debug.ajaxErrorMessageKey;
                    if(data.hasOwnProperty(errKey) && data[errKey]) {
                        App.Collection.Dialogs['error-dialog'].setContent(data[errMsg]).Modal().Show();
                    }
                }
            } catch(e) {
                data = response;
            }
            return data;
        },
        success: function() {
            $('body #loader').remove();
        }
    }
}
