App.Modules.GraphTypeSelector = (function($){

    function _bindEventListeners() {
        $('#graph1-type-selector').change(function(evt){ evt.preventDefault();
            $(document).trigger('graph:type', [$('#graph1-type-selector').val()]);
        });
    }

    return {
        autoInit: function() {
            _bindEventListeners();
        }
    }

}(jQuery));