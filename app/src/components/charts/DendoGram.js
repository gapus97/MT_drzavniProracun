import React from 'react';
import * as d3 from 'd3';


class DendoGram extends React.Component {

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
        // set the dimensions and margins of the graph
        var width = 1400
        var height = 1080;

        // append the svg object to the body of the page
        var svg = d3.select("#zoomedDendo")
        .append("svg")
            .attr("width", width)
            .attr("height", height);

        var g = svg.append("g").attr("transform", "translate(40,0)");
        //var g = svg.append("g").attr("transform", "translate(" + (width / 2 - 15) + "," + (height / 2 + 25) + ")");

        // read json data
        var data = this.props.data;


        // Create the cluster layout:
        var cluster = d3.cluster()
            .size([height, width - 300]);  // 300 is the margin I will have on the right side

        // Give the data to this cluster layout:
        var root = d3.hierarchy(data, function(d) {
            return d.children;
        });
        cluster(root);





            var experienceName = ["", "","","","",""];
            var formatSkillPoints = function (d) {
                return experienceName[d % 6];
            }
            var xScale =  d3.scaleLinear()
                    .domain([0, 280000])
                    .range([0, 2800]);
        
            var xAxis = d3.axisTop()
                    .scale(xScale)
                    .ticks(5)
                    .tickFormat(formatSkillPoints);

            var link = g.selectAll(".link")
                .data(root.descendants().slice(1))
                .enter().append("path")
                .attr("class", "link")
                .attr("d", function(d) {
                    return "M" + d.y + "," + d.x
                            + "C" + (d.parent.y + 100) + "," + d.x
                            + " " + (d.parent.y + 100) + "," + d.parent.x
                            + " " + d.parent.y + "," + d.parent.x;
                });

        // Setup position for every datum; Applying different css classes to parents and leafs.
        var node = g.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        // Draw every datum a small circle.
        node.append("circle")
                .attr("r", 7);

        // Setup G for every leaf datum.
        var leafNodeG = g.selectAll(".node--leaf")
                .append("g")
                .attr("class", "node--leaf-g")
                .attr("transform", "translate(" + 8 + "," + -13 + ")");


        leafNodeG.append("text")
                .attr("dy", 19.5)
                .attr("x", 2)
                .style("text-anchor", "start")
                .text(function (d) {
                    return d.data.name + " - " + d.data.value;
                });

        // Write down text for every parent datum
        var internalNode = g.selectAll(".node--internal");
        internalNode.append("text")
                .attr("y", -10)
                .style("text-anchor", "middle")
                .text(function (d) {
                    return d.data.name;
                });

        // Attach axis on top of the first leaf datum.
        var firstEndNode = g.select(".node--leaf");
            firstEndNode.insert("g")
                    .attr("class","xAxis")
                    .attr("transform", "translate(" + 7 + "," + -14 + ")")
                    .call(xAxis);

            // tick mark for x-axis
            firstEndNode.insert("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(7," + (height - 15) + ")")
                    .call(d3.axisBottom()
                            .scale(xScale)
                            .ticks(5)
                            .tickSize(-height, 0, 0)
                            .tickFormat("")
                    );

        // Emphasize the y-axis baseline.
        svg.selectAll(".grid").select("line")
                .style("stroke-dasharray","20,1")
                .style("stroke","black");




    }


    render() {   
        
        return (
            <div id="zoomedDendo">
            </div>
        );
        
    }
}

export default DendoGram;