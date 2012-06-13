App.Modules.RedrawButton = (function($){

    function _bindEventListeners()
    {
        $('#redraw-graph').click(function(e){ e.preventDefault();
            var data = [{
                            name: 'Kiev',
                            data: [232, 422, 244]
                        }, {
                            name: 'Moscow',
                            data: [2343, 3533, 6743]
                        }];
            App.Collection.Tabs['main-tabs'].setActiveTab('tab2');
            $(document).trigger('graph:newdata', ['graf1', data]);
        });

        $('#redraw-graph-sec').click(function(e){ e.preventDefault();
            var _dataFunnel = [{
                name: 'SomeData',
                data: [
                    ['Status 1',1654],
                    ['Status 2',1064],
                    ['Status 3',987]
                ]
            }];
            //App.Collection.Tabs['main-tabs'].setActiveTab('funnel');
            $(document).trigger('graph:newdata', ['graf2', _dataFunnel]);
        });
    }

    return {
        autoInit: function() {
            _bindEventListeners();
        }
    }

}(jQuery));