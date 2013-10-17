Rickshaw.namespace('Rickshaw.Graph.Renderer.CustomLine');

Rickshaw.Graph.Renderer.Line = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {
    name : 'customline',
    /*
    Might not need to include defaults as it's the same as the
    parent 
    */
    defaults: function($super) {
        return Rickshaw.extend( $super(), {
            unstack: true,
            fill: false,
            stroke: true
        } );
    },
    seriesPathFactory: function() {
        var graph = this.graph;
        
        var factory = d3.svg.line()
            .x( function(d) { return graph.x(d.x) } )
            .y( function(d) { return graph.y(d.y) } )
            .interpolate(this.graph.interpolation).tension(this.tension);

        factory.defined && factory.defined( function(d) { return d.y !== null } );
        return factory;
    },
    _styleSeries: function(series) {

        var fill = this.fill ? series.color : 'none';
        var stroke = this.stroke ? series.color : 'none';

        series.path.setAttribute('fill', fill);
        series.path.setAttribute('stroke', stroke);

        if (series.name == 'baseline') {

            console.log("Special Stroke");
            console.log(series);

            series.path.setAttribute('stroke-width', 1);
        }
        else {
            series.path.setAttribute('stroke-width', this.strokeWidth);
        }
        series.path.setAttribute('class', series.className);
    },
    render: function(args) {
        args = args || {};

        var graph = this.graph;
        var series = args.series || graph.series;

        var vis = args.vis || graph.vis;
        vis.selectAll('*').remove();

        var data = series
            .filter(function(s) { return !s.disabled })
            .map(function(s) { return s.stack });

        var nodes = vis.selectAll("path")
            .data(data)
            .enter().append("svg:path")
            .attr("d", this.seriesPathFactory());

        var i = 0;
        series.forEach( function(series) {

            if (series.disabled) return;
            series.path = nodes[0][i++];
            this._styleSeries(series);


        }, this );
    }
});
