(function (App, $) {
	'use strict';
	var dataTablesHandlers = [];
	
	function doMagicTable(table) {
		return table.dataTable({
			'bJQueryUI' : true,
			'bFilter': false,
			'bSort': true,
			'iDisplayLength' : 25,
			'bProcessing' : true,
			'aoColumns': [
				{ "bSortable": false }, // flags
				{ "sType": 'numbers' }, // ID
				null, // client
				null, // ttl
				null, // country
				null, // engag
                null,
				null, // sm
				null, // pm
				{ "sType": 'numbers' }, // budget
				{ "sType": 'numbers' }, // ch t w
				null, // techs
				{ "sType": 'us_date' },
				{ "sType": 'us_date' },
				{ "sType": 'us_date' },
				null //hrs
			],
			'sPaginationType' : "full_numbers"
		});
	};
	
	function makeUglyTableBeautiful(container) {
		$("h2.collapsible").click(function(){
			if($(this).next().is('table')) {
				$(this).next().css('display', 'block');
				var dataTable = doMagicTable( $(this).next() );
				dataTablesHandlers.push( dataTable );
				$(this).next().toggle();
			}
		});

		container.find('.dataTable').each(function () {
			if( !$(this).hasClass('lazy-table') ) {
				dataTablesHandlers.push( doMagicTable( $(this) ) );
			} else {
				$(this).css('display', 'none');
			}
		});

		container.fadeTo(333, 1);
	};

	App.Modules.Register('DataDrawer', {
		init : function() {
			App.EM.bind('DataDrawer:OverviewDataInjected', makeUglyTableBeautiful);
		}
	});
})(App, jQuery);