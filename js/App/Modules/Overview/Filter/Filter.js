(function (App, $) {
	'use strict';
	var form = $("form#filtering"),
		typingInterval = null;

	function resetFilterForm() {
		form.find('input:text, input:password, input:file, select, textarea').val('');
	    form.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
	    typingInterval = null;
	    clearTimeout(typingInterval);
	    App.EM.trig('filterСhanged');
	}

	function getFilterSerialized() {
		return form.serialize();
	}

	function initialize() {
		// Initialize UI
		$('form#filtering select').change(function () {
			App.EM.trig('filterChanged', getFilterSerialized());
		});

		$("#searchterm").keydown(function() {
			clearTimeout(typingInterval);
			typingInterval = null;
			typingInterval = setTimeout(function(){
				App.EM.trig('filterChanged', getFilterSerialized());
			}, 400);
		});

		$('#created-period-from').datepicker({
			dateFormat: "dd M yy",
			onSelect: function(selectedDate) {
				$("#created-period-to").datepicker( "option", "minDate", selectedDate );
				App.EM.trig('filterChanged', getFilterSerialized());
			}
		});

		$('#created-period-to').datepicker({
			dateFormat: "dd M yy",
			onSelect: function(selectedDate) {
				$("#created-period-from").datepicker( "option", "maxDate", selectedDate );
				App.EM.trig('filterChanged', getFilterSerialized());
			}
		});

		$("#drop-filters").click(function(e) {
			e.preventDefault();
			resetFilterForm();
		});

		// Load data for the first time, when page has been loaded.
		App.EM.trig('filterChanged', getFilterSerialized());
	}

	// Module registration
	// Public interface
	// ----------------------------------------------
	App.Modules.Register('Filter', {
		init : initialize,
		reset : resetFilterForm,
		serialized : getFilterSerialized
	});
})(App, jQuery);