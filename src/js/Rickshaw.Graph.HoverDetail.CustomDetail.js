Rickshaw.namespace('Rickshaw.Graph.HoverDetail.CustomDetail');

Rickshaw.Graph.CustomHoverDetail = Rickshaw.Class.create( Rickshaw.Graph.HoverDetail, {
    formatter: function(series, x, y) {
        var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
        //var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
        var content = series.name + ": " + parseInt(y, 10) + '<br>' + date;
        return content;
    },
    update: function(e) {

        e = e || this.lastEvent;
        if (!e) return;
        this.lastEvent = e;

        if (!e.target.nodeName.match(/^(path|svg|rect|circle)$/)) return;

        var graph = this.graph;

        var eventX = e.offsetX || e.layerX;
        var eventY = e.offsetY || e.layerY;

        var j = 0;
        var points = [];
        var nearestPoint;

        this.graph.series.active().forEach( function(series) {

            var data = this.graph.stackedData[j++];

            if (series.custom_hidden || series.name == 'baseline')
                /*
                 * This will remove hidden series and baseline series data points from being computed
                 * meaning the highlight "snap-to" line functinality will ignore these series
                 */
                return;

            if (!data.length)
                return;

            var domainX = graph.x.invert(eventX);

            var domainIndexScale = d3.scale.linear()
                .domain([data[0].x, data.slice(-1)[0].x])
                .range([0, data.length - 1]);

            var approximateIndex = Math.round(domainIndexScale(domainX));
            if (approximateIndex == data.length - 1) approximateIndex--;

            var dataIndex = Math.min(approximateIndex || 0, data.length - 1);

            for (var i = approximateIndex; i < data.length - 1;) {

                if (!data[i] || !data[i + 1]) break;

                if (data[i].x <= domainX && data[i + 1].x > domainX) {
                    dataIndex = Math.abs(domainX - data[i].x) < Math.abs(domainX - data[i + 1].x) ? i : i + 1;
                    break;
                }

                if (data[i + 1].x <= domainX) { i++ } else { i-- }
            }

            if (dataIndex < 0) dataIndex = 0;
            var value = data[dataIndex];

            var distance = Math.sqrt(
                Math.pow(Math.abs(graph.x(value.x) - eventX), 2) +
                Math.pow(Math.abs(graph.y(value.y + value.y0) - eventY), 2)
            );

            var xFormatter = series.xFormatter || this.xFormatter;
            var yFormatter = series.yFormatter || this.yFormatter;

            var point = {
                formattedXValue: xFormatter(value.x),
                formattedYValue: yFormatter(series.scale ? series.scale.invert(value.y) : value.y),
                series: series,
                value: value,
                distance: distance,
                order: j,
                name: series.name
            };

            if (!nearestPoint || distance < nearestPoint.distance) {
                nearestPoint = point;
            }

            points.push(point);

        }, this );

        if (!nearestPoint)
            return;

        nearestPoint.active = true;

        var domainX = nearestPoint.value.x;
        var formattedXValue = nearestPoint.formattedXValue;

        this.element.innerHTML = '';
        this.element.style.left = graph.x(domainX) + 'px';

        this.visible && this.render( {
            points: points,
            detail: points, // for backwards compatibility
            mouseX: eventX,
            mouseY: eventY,
            formattedXValue: formattedXValue,
            domainX: domainX
        } );
    },
});
