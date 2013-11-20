Rickshaw.namespace('Rickshaw.Graph.Behavior.Series.Toggle');

Rickshaw.Graph.Behavior.Series.Toggle = function(args) {

    this.graph = args.graph;
    this.legend = args.legend;

    var self = this;

    var colorSafe = {};
    var activeLine = null;

    //Adding greyed out functionality that is by default found in Rickshaw.Graph.Behavior.Series.Highlight
    var disabledColor = args.disabledColor || function(seriesColor) {
        return d3.interpolateRgb(seriesColor, d3.rgb('#d8d8d8'))(0.8).toString();
    };

    //addLegendDynamic enables checkbox like behavior for an entire legend "li"
    this.addLegendDynamics = function(l) {
        //l.element.classList.add('action');
        l.element.onclick = function(e) {
            //if (l.series.disabled) {
            if (l.series.custom_hidden) {
                l.series.enable();
                //l.series.visible = true;
                l.element.classList.remove('disabled');

            } else {
                if (self.graph.series.filter(function(s) { return !s.custom_hidden }).length <= 1) return;
                l.series.disable();
                //l.series.visible = false;
                l.element.classList.add('disabled');
            }
        };  
    };

    this.addAnchor = function(line) {
        var anchor = document.createElement('a');
        anchor.innerHTML = '&#10004;';
        anchor.classList.add('action');
        line.element.insertBefore(anchor, line.element.firstChild);

        anchor.onclick = function(e) {
            if (line.series.disabled) {
                line.series.enable();
                line.element.classList.remove('disabled');
            } else { 
                if (this.graph.series.filter(function(s) { return !s.disabled }).length <= 1) return;
                line.series.disable();
                line.element.classList.add('disabled');
            }

        }.bind(this);


        var label = line.element.getElementsByTagName('span')[0];
        label.onclick = function(e){
            var disableAllOtherLines = line.series.disabled;
            
            if ( ! disableAllOtherLines ) {
                    for ( var i = 0; i < self.legend.lines.length; i++ ) {
                            var l = self.legend.lines[i];
                            if ( line.series === l.series ) {
                                    // noop
                            } else if ( l.series.disabled ) {
                                    // noop
                            } else {
                                    disableAllOtherLines = true;
                                    break;
                            }
                    }
            }

            // show all or none
            if ( disableAllOtherLines ) {
                // these must happen first or else we try ( and probably fail ) to make a no line graph

                line.series.enable();
                line.element.classList.remove('disabled');

                self.legend.lines.forEach(function(l){
                    if ( line.series === l.series ) {
                            // noop
                    } else {
                            l.series.disable();
                            l.element.classList.add('disabled');
                    }
                });
            } else {
                self.legend.lines.forEach(function(l){
                        l.series.enable();
                        l.element.classList.remove('disabled');
                });
            }

        };

    };

    if (this.legend) {

        if (typeof $ != 'undefined' && $(this.legend.list).sortable) {

            $(this.legend.list).sortable( {
                start: function(event, ui) {
                    ui.item.bind('no.onclick',
                        function(event) {
                            event.preventDefault();
                        }
                    );
                },
                stop: function(event, ui) {
                    setTimeout(function(){
                        ui.item.unbind('no.onclick');
                    }, 250);
                }
            });
        }

        this.legend.lines.forEach( function(l) {
            //self.addAnchor(l);
            /*
             * LegendDynamics takes checkbox functionality
             * from addAnchor and applies it to the entire legend button ("li")
             */
            self.addLegendDynamics(l);
        } );
    }

    this._addBehavior = function() {

        this.graph.series.forEach( function(s) {

            s.disable = function() {
                //s.disabled = true;
                s.custom_hidden = true;
                //s.visible = true;

                colorSafe[s.name] = colorSafe[s.name] || s.color;
                s.color = disabledColor(s.color);

                if (self.graph.series.length <= 1){
                    throw('only one series left');
                }
                
                self.graph.update();
            };

            s.enable = function() {
                //s.disabled = false;
                s.custom_hidden = false;
                //s.visible = false;

                if (colorSafe[s.name]) {
                    s.color = colorSafe[s.name];
                }

                self.graph.update();
            };
        } );

    };
    this._addBehavior();

	this.updateBehaviour = function () { this._addBehavior() };

};
