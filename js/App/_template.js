ObjectName = (function($) {
    var 
        params = {};
    
    var methods = {
        init: function(options)
        {
            // merge options
            $.extend(params, options, true);
        }
    }
    return methods;
})(jQuery);