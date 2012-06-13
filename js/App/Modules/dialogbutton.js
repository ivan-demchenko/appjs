App.Modules.CallDialogButton = (function($){
	
    function _bindEventListeners() {
        $('#create-item').click(function(){
        	App.EM.trig('BusinessModule.openDialog');
        });
    }

    return {
        autoInit: function() {
            _bindEventListeners();
        }
    }

}(jQuery));