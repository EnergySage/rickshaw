Rickshaw.namespace('Rickshaw.Graph.Renderer.CustomLine');

Rickshaw.Graph.Renderer.CustomLine = Rickshaw.Class.create( Rickshaw.Graph.Renderer, {

    name : 'customline',

    defaults: function($super) {
        return Rickshaw.extend( $super(), {
            fill: false,
            stroke: true,
            unstack: true
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
        series.path.setAttribute('stroke-width', this.baselineStrokeWidth);
        series.path.setAttribute('class', series.className);
    },
});
