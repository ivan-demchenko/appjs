App = App || {};
App.Settings = {
	baseURL : '/',
	dateFormat : 'd M, yy',
	modulesLocation : '/js/App/Modules/',
	defaultScope : $('body'),
	Debug : {
		enabled : true,
		sendReports : false,
		errorReportingUrl : '/error.php',
		ajaxErrorKey : 'error',
		ajaxErrorMessageKey : 'rawMessage',
	},
	GetModulesScheme : function () {
		var s = {
			'/' : ['dialogButton'],
			'/AppJS/index.html' : ['dialogButton']
		};
		return s;
	},
	ajaxResponders : {
		startLoading : function () {
			$('body').append('<div id="loader">Loading...</div>');
		},
		errorOccured : function (jqXHR, textStatus, errorThrown, URL) {
			if (App.Settings.Debug.enabled) {
				var msg = 'Ajax error for URL: ' + URL + ', see logs (F12) for more details...';
				App.Collection.Dialogs['error-dialog'].SetContent(msg).Modal().Show();
				console.warn('Ajax error: ');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		},
		errorRequestProcessor : function (response, dataType) {
			if (App.Settings.Debug.enabled) {
				switch (dataType) {
				case 'jsonp':
				case 'json': {
						var errKey = App.Settings.Debug.ajaxErrorKey,
						errMsg = App.Settings.Debug.ajaxErrorMessageKey;
						if (response.hasOwnProperty(errKey) && response[errKey]) {
							App.Collection.Dialogs['error-dialog'].SetContent(response[errMsg]).Modal().Show();
							return false;
						}
						break;
					}
				case 'html': {
						if (response.indexOf('xdebug-error') > -1) {
							App.Collection.Dialogs['error-dialog'].SetContent(response).Modal().Show();
							return false;
						}
						break;
					}
				}
			}
			return true;
		},
		success : function () {
			$('body #loader').remove();
		}
	}
}