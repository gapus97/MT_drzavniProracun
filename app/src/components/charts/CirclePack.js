import React from 'react';
import * as d3 from 'd3';
import { getCategorieComparisonByYear, parseMoney } from '../../utils/ParsingUtils';
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

    componentDidUpdate({ data }) {
        if (this.props.data !== data) {
            this.drawLegend();
            this.constructGraph();

            let categoricalData = getCategorieComparisonByYear(this.props.data, this.props.city.toUpperCase());
            this.comparisonGraph(categoricalData);

        }
    }

    showText(d) {
        const value = parseMoney(d.data.value);
        const name = d.data.name;

        let data = getCategorieComparisonByYear(this.props.data, name);

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

    showDataOnMouseMove(d) {
        const name = d.data.name;
        const value = parseMoney(d.data.value);



        if (value && name) {
            let data = getCategorieComparisonByYear(this.props.data, name);

            this.comparisonGraph(data);
            this.setState({
                textName: name,
                textValue: value
            });
        }
    }


    constructGraph() {
        d3.select("#circlePack").select("svg").remove();
        var color = d3.scaleSequential([8, 0], d3.interpolateMagma);
        var format = d3.format(",d");
        var height = 400;
        var width = 400;
        var pack = data => d3.pack()
            .size([width - 2, height - 2])
            .padding(15)
            (d3.hierarchy(data)
                .sort((a, b) => b.value - a.value));


        const root = pack(this.props.data[0][2018][0]);
        var margin = { top: 20, right: 20, bottom: 30, left: 40 };

        const svg = d3.select("#circlePack").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("font", "10px sans-serif")
            .attr("text-anchor", "middle");

        const shadow = "SHADOW";

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
            .on("mouseover", (d) => this.showDataOnMouseMove(d))
            .on("mouseout", () => this.hideText());

        let current_circle = undefined;

        node.append("circle")
            .attr("r", d => d.r)
            .attr("fill", d => color(d.height))
            .on("mouseover", circleSelect)
            .on("mouseout", circleUnSelect)
            .on("click", circleSelect);


        function circleSelect(d) {
            // cleanup previous selected circle
            if (current_circle !== undefined) {
                current_circle.attr("fill", d => color(d.height));
            }

            // select the circle
            current_circle = d3.select(this);
            //console.log("Current circle: ", current_circle);
            current_circle.attr("fill", "#b2e1f9");

        }

        function circleUnSelect(d) {
            if (current_circle !== undefined) {
                current_circle.attr("fill", d => color(d.height));
            }
        }

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

    drawLegend() {
        d3.select("#legend").select("svg").remove();
        //Make an SVG Container
        var svgContainer = d3.select("#legend").append("svg")
            .attr("width", 600)
            .attr("height", 50);
        //Draw the Circle
        var circle = svgContainer.append("circle")
            .attr("cx", 50)
            .attr("cy", 30)
            .attr("r", 20);
        var circle2 = svgContainer.append("circle")
            .attr("cx", 220)
            .attr("cy", 30)
            .attr("r", 20);
        var circle3 = svgContainer.append("circle")
            .attr("cx", 370)
            .attr("cy", 30)
            .attr("r", 20);
        var circle4 = svgContainer.append("circle")
            .attr("cx", 520)
            .attr("cy", 30)
            .attr("r", 20);    
        // set circle color
        circle.attr("fill", "#FE7B5F"); //glavna kategorija
        circle2.attr("fill", "#FFC386");
        circle3.attr("fill", "#F8FFBE");
        circle4.attr("fill", "#b2e1f9");

    }

    comparisonGraph(data) {
        let graphData = [];

        for (const [key, value] of Object.entries(supportedYears)) {
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

        if (!graphData) {
            return;
        }

        d3.select("#comparisonGraph").select("svg").remove();


        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
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
        x.domain(graphData.map(function (d) { return d.year; }));
        y.domain([0, d3.max(graphData, function (d) { return d.value; })]);



        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(graphData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - y(d.value); });

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
                    <Col>
                        <div id="circlePack" />
                    </Col>
                    <Col md={6}>
                        <Row>
                            <div id="comparisonGraph" />
                        </Row>
                    </Col>
                </Row>
                <Row>                
                    <Col md="auto">
                        <p>Legenda:</p>
                            <div>
                                <pre style={{display: 'inline' }}>Glavna kategorija   </pre>
                                <pre style={{display: 'inline' }}>Pod kategorija   </pre>
                                <pre style={{display: 'inline' }}>Koncna kategorija   </pre>
                                <p style={{display: 'inline' }}>Izbrana kategorija</p>                               
                                <div id="legend" />
                                </div>
                    </Col>
                    <Col md="auto">
                        <p>Kategorija: {this.state.textName} </p>
                        <p>Vrednost 2018:  {this.state.textValue} </p>
                    </Col>    
                </Row>

            </Container>
        );

    }
}

export default CirclePack;