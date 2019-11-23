import React from 'react';
import * as d3 from 'd3';
import {getCategorieComparisonByYear } from '../../utils/ParsingUtils';
import { supportedYears } from '../../utils/Queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CirclePack extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            textValue: "",
            textName: "",
            comparisonData: []
        };
        
    }

    componentDidUpdate({data}) {
        if(this.props.data !== data) {
            console.log("Method calll");
            this.constructGraph();

        }
    }

    showText(d) {
        const value = (d.data.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        const name = d.data.name;

        let data  = getCategorieComparisonByYear(this.props.data, name);

        this.comparisonGraph(data);


        this.setState({
            textValue: value,
            textName: name,
            comparisonData: data
        });
    }

    hideText() {
        /*this.setState({
            textValue: "",
            textName: ""
        }); */
    }


    constructGraph() {
        d3.select("#circlePack").select("svg").remove();
       var color = d3.scaleSequential([8, 0], d3.interpolateMagma);
       var format = d3.format(",d");
       var height = 400;
        var width=400;
       var pack = data => d3.pack()
            .size([width - 2, height - 2])
            .padding(3)
          (d3.hierarchy(data)
            .sort((a, b) => b.value - a.value))

            
         const root = pack(this.props.data[0][2018][0]);
         var margin = {top: 20, right: 20, bottom: 30, left: 40};

         

          const svg = d3.select("#circlePack").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("font", "10px sans-serif")
            .attr("text-anchor", "middle");

          const shadow ="SHADOW";

          svg.append("filter")
              .attr("id", shadow.id)
            .append("feDropShadow")
              .attr("flood-opacity", 0.3)
              .attr("dx", 0)
              .attr("dy", 1);

          const node = svg.selectAll("g")
            .data(d3.nest().key(d => d.height).entries(root.descendants()))
            .join("g")
            .attr("filter", shadow)
            .selectAll("g")
            .data(d => d.values)
            .join("g")
              .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
            .on("mouseover", (d) => {})
            .on("mouseout", () => this.hideText())
            .on("click", (d) => this.showText(d));

          node.append("circle")
              .attr("r", d => d.r)
              .attr("fill", d => color(d.height));

          const leaf = node.filter(d => !d.children);

          leaf.select("circle")
              .attr("id", d => (d.leafUid = "shadow").id);

          leaf.append("clipPath")
              .attr("id", d => (d.clipUid = "desdes").id)
            .append("use")
              .attr("xlink:href", d => d.leafUid.href);


          node.append("title")
              .text(d => 
                  `${d.ancestors().map(d => d.data.name).reverse().join("/\n")}\n${format(d.value)}`           
                );

    }

    comparisonGraph(data) {
        let graphData = [];

        for(const [key, value] of Object.entries(supportedYears)) {
            let yearData = data[0][key];
            if (yearData[0]) {
                console.log("Year data: ", yearData);
                graphData.push({
                    year: key, 
                    value: yearData[0].value
                });
            }


        }
        console.log("Result: ", graphData);

        if(!graphData) {
            return;
        }

        d3.select("#comparisonGraph").select("svg").remove();


        // set the dimensions and margins of the graph
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

            // set the ranges
            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);


            var y = d3.scaleLinear()
                .range([height, 0]);
                
            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select("#comparisonGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");


              // Scale the range of the data in the domains
                x.domain(graphData.map(function(d) { return d.year; }));
                y.domain([0, d3.max(graphData, function(d) { return d.value; })]);

                

                // append the rectangles for the bar chart
                svg.selectAll(".bar")
                    .data(graphData)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.year); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return height -  y(d.value); });

                // add the x Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                // add the y Axis
                svg.append("g")
                    .attr("transform", "translate(10,0)")
                    .call(d3.axisLeft(y));
    }

    render() {
        return (
            <Container className="circlePack-root">

                <Row>
                    <Col md={6}>
                        <div id="circlePack">
                            
                        </div>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <div id="comparisonGraph">

                            </div>
                        </Row>
                        <Row>
                            <p>Kategorija: {this.state.textName} </p>
                        </Row>
                    </Col>
                </Row>
            
            </Container>
        );

    }
}

export default CirclePack;