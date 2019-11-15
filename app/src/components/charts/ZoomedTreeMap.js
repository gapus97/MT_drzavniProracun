import React from 'react';
import * as d3 from 'd3';


class ZoomedTreeMap extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentDidUpdate({data}) {
        if(this.props.data !== data) {
            this.constructGraph();
        }
    }


    constructGraph() {
        // replace this with real API-data
        var el_id = 'zoomedTreeMap';
        var divWidth = 1920;

        var margin = {top: 30, right: 0, bottom: 20, left: 0},
            width = divWidth -25,
            height = 800 - margin.top - margin.bottom,
            formatNumber = d3.format(","),
            transitioning;

        // sets x and y scale to determine size of visible boxes
        var x = d3.scaleLinear()
            .domain([0, width])
            .range([0, width]);
        var y = d3.scaleLinear()
            .domain([0, height])
            .range([0, height]);


        var color = d3.scaleOrdinal()
        .range(d3.schemeCategory10
        .map(function(c) { c = d3.rgb(c); c.opacity = 0.8; return c; }));

        
        var tip=d3.select('#'+el_id).append('div')
        .attr('class', 'tooltip')
        .style('position','absolute')
        .style('padding','5px 10px')
        .style('background','white')
        .style('opacity',0);

        var treemap = d3.treemap()
                .tile(d3.treemapResquarify.ratio(height/ width * 0.5 * (1 + Math.sqrt(5))))
                .size([width, height])
                .paddingInner(0)
                .round(false);
        var svg = d3.select('#'+el_id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
            .style("margin-left", -margin.left + "px")
            .style("margin.right", -margin.right + "px")
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("shape-rendering", "crispEdges");
        var grandparent = svg.append("g")
                .attr("class", "grandparent");
            grandparent.append("rect")
                .attr("y", -margin.top)
                .attr("width", width)
                .attr("height", margin.top)
                .attr("fill", '#bbbbbb');
            grandparent.append("text")
                .attr("x", 6)
                .attr("y", 6 - margin.top)
                .attr("dy", ".75em");
       
        var root = d3.hierarchy(this.props.data);
        
        treemap(root
            .sum(function (d) {
                return d.value;
            })
            .sort(function (a, b) {
                return b.height - a.height || b.value - a.value
            })
        );
        display(root);
        function display(d) {
            // write text into grandparent
            // and activate click's handler
            grandparent
                .datum(d.parent)
                .on("click", transition)
                .select("text")
                .text(`Občina ${name(d)}; Skupaj proračun: ${d3.format(",")(d.data.value)}`)
            // grandparent color
            grandparent
                .datum(d.parent)
                .select("rect")
                .attr("fill", function () {
                    return '#bbbbbb'
                });
            var g1 = svg.insert("g", ".grandparent")
                .datum(d)
                .attr("class", "depth");
            var g = g1.selectAll("g")
                .data(d.children)
                .enter()
                .append("g");
            // add class and click handler to all g's with children
            g.filter(function (d) {
                return d.children;
            })
                .classed("children", true)
                .on("click", transition);
            g.selectAll(".child")
                .data(function (d) {
                    return d.children || [d];
                })
                .enter()
                .append("rect")
                .attr("class", "child")
                .call(rect);
            // add title to parents
            g.append("rect")
                .attr("class", "parent")
                .call(rect)
                .append("title")
                .text(function (d){
                    return d.data.name;
                });
            /* Adding a foreign object instead of a text object, allows for text wrapping */
            g.append("foreignObject")
                .call(rect)
                .attr("class", "foreignobj")
                .on('mousemove', function(d){return toolTip(d)})
                .on('mouseout', function(d){return toolTipOff(d)})
                .append("xhtml:div")
                .attr("dy", ".75em")
                .html(function (d) {
                    return '' +
                        '<p class="title"> ' + d.data.name + '</p>' +
                        '<p>' + formatNumber(d.data.value) + '</p>'
                    ;
                })
                .attr("class", "textdiv"); //textdiv class allows us to style the text easily with CSS
            function transition(d) {
                if (transitioning || !d) return;
                transitioning = true;
                var g2 = display(d),
                    t1 = g1.transition().duration(650),
                    t2 = g2.transition().duration(650);
                // Update the domain only after entering new elements.
                x.domain([d.x0, d.x1]);
                y.domain([d.y0, d.y1]);
                // Enable anti-aliasing during the transition.
                svg.style("shape-rendering", null);
                // Draw child nodes on top of parent nodes.
                svg.selectAll(".depth").sort(function (a, b) {
                    return a.depth - b.depth;
                });
                // Fade-in entering text.
                g2.selectAll("text").style("fill-opacity", 0);
                g2.selectAll("foreignObject div").style("display", "none");
                /*added*/
                // Transition to the new view.
                t1.selectAll("text").call(text).style("fill-opacity", 0);
                t2.selectAll("text").call(text).style("fill-opacity", 1);
                t1.selectAll("rect").call(rect);
                t2.selectAll("rect").call(rect);
                /* Foreign object */
                t1.selectAll(".textdiv").style("display", "none");
                /* added */
                t1.selectAll(".foreignobj").call(foreign);
                /* added */
                t2.selectAll(".textdiv").style("display", "block");
                /* added */
                t2.selectAll(".foreignobj").call(foreign);
                /* added */
                // Remove the old node when the transition is finished.
                t1.on("end.remove", function(){
                    this.remove();
                    transitioning = false;
                });
            }

            function toolTip(d) {
                var xPosition = d3.event.pageX + 5;
                var yPosition = d3.event.pageY + 5;


                if (xPosition>width/2) {
                  xPosition=xPosition-tip.style("width").replace("px", "")-5;
                }
                if (yPosition>height){
                  yPosition=yPosition-tip.style("height").replace("px", "")-10;
                }
                if(d.data.name) {
                  tip.style('opacity',.9)
                  .html("<b>"+d.data.name+ "</b> </br> Skupaj: "+formatNumber(d.data.value.toFixed(2)) + "€")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");
                }
                else {
                  tip.style('opacity',.9)
                  .html("<b>€"+formatNumber(d.data.value.toFixed(2))+"</b>"+d.data.name)
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");
                }
            }
            
            function toolTipOff(d) {
                tip.style('opacity',0);
            };
            
            return g;
        }
        function text(text) {
            text.attr("x", function (d) {
                return x(d.x) + 6;
            })
            .attr("y", function (d) {
                    return y(d.y) + 6;
            });
        }
        function rect(rect) {
            rect
                .attr("x", function (d) {
                    return x(d.x0);
                })
                .attr("y", function (d) {
                    return y(d.y0);
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0);
                })
                .attr("height", function (d) {
                    return y(d.y1) - y(d.y0);
                })
                .attr("fill", function (d) {
                    return '#bbbbbb';
                })
                .style("background", function(d) {
                    return d.parent ? color(d.data.name) : null;
                });
        }
        function foreign(foreign) { /* added */
            foreign
                .attr("x", function (d) {
                    return x(d.x0);
                })
                .attr("y", function (d) {
                    return y(d.y0);
                })
                .attr("width", function (d) {
                    return x(d.x1) - x(d.x0);
                })
                .attr("height", function (d) {
                    return y(d.y1) - y(d.y0);
                });
        }
        function name(d) {
            return breadcrumbs(d) +
                (d.parent
                ? " -  Click to zoom out"
                : " - Click inside square to zoom in");
        }
        function breadcrumbs(d) {
            var res = "";
            var sep = " > ";
            d.ancestors().reverse().forEach(function(i){
                res += i.data.name + sep;
            });
            return res
                .split(sep)
                .filter(function(i){
                    return i!== "";
                })
                .join(sep);
        }
    
    }



    render() {   
        console.log("Test");
        return (
            <div id="zoomedTreeMap">
            </div>
        );
        
    }
}

export default ZoomedTreeMap;