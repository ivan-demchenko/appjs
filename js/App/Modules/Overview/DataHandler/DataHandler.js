(function (App, $) {
	'use strict';
	var loadURL = '/get-projects-list',
		container = $(".bodyContainer");
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- 
	// Finished sortings
	function loadOverview(data) {
		container.fadeTo(333, 0.3, function(){
			App.Storage.Ajax.Data(data).Post(loadURL, function (data) {
				container.html(data.template);
				App.EM.trig('OverviewDataInjected', container);
			});
		});
	};

	App.Modules.Register('DataHandler', {
		init : function() {
			App.EM.bind('Overview:filterChanged', loadOverview);
			makeUglyTableBeautiful();
		}
	});
})(App, jQuery);