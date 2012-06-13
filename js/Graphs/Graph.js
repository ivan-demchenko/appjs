/**
 * Short story about this stuff
 * 
 * It supports such kinds of graphs:
 *  - spline
 *  - area
 *  - bars
 *  - strackedBars
 *  - pie
 * 
 * In the top of this file we have initial settings for graphs
 * 
 * In the bottom there is an interface.
 * 
 * To graw some graphs you need to call this chain:
 * 
 *      <div id="grafContainer"></div>
 *      ...
 *      <script>
 *          Graph.Gear.Init('area', 'grafContainer').Title('My graph title').Data([{}, {}, ..., {}]).Draw();
 *      </script>
 * where `area` is type of graf and `grafContainer` is div's id where graf is gonna appear.
 * 
 * After, you can find the instance of grapg in collestion by it's id:
 * 
 *      Graph.Collection['grafContainer']...
 * 
 * So, as you already notices, div's id = graf's id.
 */
var Graph = Graph || {};
Graph.Collection = [];

/**
 * Settings are separated to make them more common
 * for different types of graphs
 */

/**
 * General Settings
 */
Graph.InitialSettings = {
    chart: {
        renderTo: 'graph'
    },
    title: {
        text: "Don't forget about title ;)"
    },
    tooltip: {
        crosshairs: true,
        shared: true
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            formatter: function() {
                return '$ '+this.value
            }
        }
    },
};

/**
 * Spline
 */
Graph.InitialForLine = $.extend({}, Graph.InitialSettings, {
    chart: {
        type: 'spline'
    },
    plotOptions: {
        spline: {
            marker: {
                radius: 4,
                lineColor: '#666666',
                lineWidth: 1
            }
        }
    },
    series: []
});

/**
 * Area
 */
Graph.InitialForArea = $.extend({}, Graph.InitialSettings, {
    chart: {
        type: 'area'
    },
    plotOptions: {
        area: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 5,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: []
});

/**
 * Bars
 */
Graph.InitialForBars = $.extend({}, Graph.InitialSettings, {
    chart: {
        type: 'column'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: []
});

/**
 * Stacked Bars
 */
Graph.InitialForStackedBars = $.extend({}, Graph.InitialSettings, {
    chart: {
        type: 'column'
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
            }
        }
    },
    series: []
});

/**
 * Pie
 */
Graph.InitialForPie = $.extend({}, Graph.InitialSettings, {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        type: 'pie',
        data: []
    }]
});

/**
 * Funnel
 */
Graph.InitialForFunnel = $.extend({}, Graph.InitialSettings, {
    chart: {
        defaultSeriesType: 'funnel',
    },
    plotArea: {
        shadow: null,
        borderWidth: null,
        backgroundColor: null
    },
    tooltip: {
        formatter: function() {
            return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.y, 0);
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                align: 'left',
                x: -300,
                enabled: true,
                formatter: function() {
                    return '<b>'+ this.point.name +'</b> ('+ Highcharts.numberFormat(this.point.y, 0) +')';
                },
                color: 'black'
            },
            
            neckWidth: '30%',
            neckHeight: '25%'
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Data',
        data: []
    }]
});

function GraphObject(inputParams)
{
    'use strict';

    var 
        _type = 'spline',
        _data = [],
        _params = inputParams,
        _chart = null;

    function _checkElement() {
        if($("#"+_params.chart.renderTo).length == 0) {
            throw 'Element to render graph is not defined!';
            return false;
        }
        return true;
    }
    
    /**
     * Set parameters. Read Highcharts manual.
     */
    function _setParameters(param) {
        $.extend(true, _params, param);
        _drawChart();
        return this;
    }

    /**
     * Set or Get Data
     */
    function _setGetData(data) {
        if(data == undefined) {
            return _params.series;
        } else {
            if(_params == null) {
                throw 'Graph params are not initialized';
            } else {
                _params.series = data;
            }
        }
        return this;
    }
    
    /**
     * Add Constituent to data array
     */
    function _addData(data) {
        if(data == undefined) {
            return _params.series;
        } else {
            if(_params == null) {
                throw 'Graph params are not initialized';
            } else {
                _params.series.data.push(data);
            }
        }
        return this;
    }

    /**
     * Draw Graph
     */
    function _drawChart() {
        if(_checkElement()) {
            if(!Highcharts) {
                throw 'Highcharts is not initialized.';
                return false;
            }
            $("#"+_params.chart.renderTo).html('');
            _chart = new Highcharts.Chart(_params);
        }
        return this;
    }
    
    /**
     * Get Highchart handler
     */
    function _getHandler() {
        return _chart;
    }
    
    /**
     * Set or Get Title
     */
    function _setGetTitle(val) {
        if(val == undefined) {
            return _params.title.text;
        } else {
            _params.title.text = val;
        }
        return this;
    }
    
    /**
     * Set or Get Type
     */
    function _setGetType(val) {
        if(val == undefined) {
            if(_type=='funnel')
                return _params.chart.defaultSeriesType;
            else
                return _params.chart.type;
        } else {
            _params.chart.type = val;
        }
        return this;
    }
    
    return {
        Draw: _drawChart,
        Title: _setGetTitle,
        Type: _setGetType,
        Set: _setParameters,
        Data: _setGetData,
        AddData: _addData,
        Handler: _getHandler
    }
}

/**
 * 
 */
Graph.Gear = (function(){
    'use strict';
    
    /**
     * Binding event handlers
     */
    function _bindEventHanders()
    {
        //Event Handlers Callbacks
        function _applyNewData(event, target, data) {
            if(typeof target != 'string' || Graph.Collection[target] == undefined) {
                throw 'Graph: Target graph is undefined';
            } else {
                Graph.Collection[target].Data(data).Draw();
            }
        }
        
        function _changeGraphType(event, target, type) {
            if(typeof target != 'string' || Graph.Collection[target] == undefined) {
                throw 'Graph: Target graph is undefined';
            } else {
                Graph.Collection[target].Type(type).Draw();
            }
        }
        
        $(document).on('graph:newdata', _applyNewData);
        $(document).on('graph:type', _changeGraphType);
    }

    /**
     * Initialize Graph handler
     */
    function _initialize(type, elementID)
    {
        _bindEventHanders();
        var _params = null;
        switch (type)
        {
            case 'spline': {
                _params = Graph.InitialForLine;
                break;
            }
            case 'area': {
                _params = Graph.InitialForArea;
                break;
            }
            case 'pie': {
                _params = Graph.InitialForPie;
                break;
            }
            case 'bars': {
                _params = Graph.InitialForBars;
                break;
            }
            case 'strackedBars': {
                _params = Graph.InitialForStackedBars;
                break;
            }
            case 'funnel': {
                _params = Graph.InitialForFunnel;
                break;
            }
        }
        _params.chart.renderTo = elementID;
        Graph.Collection[elementID] = new GraphObject(_params);
        return Graph.Collection[elementID];
    }

    
    return {
        Init: _initialize,
    }

}());