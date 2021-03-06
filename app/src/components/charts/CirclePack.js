import React from 'react';
import * as d3 from 'd3';
import { parseMoney, getCategoriesComparisonByYear } from '../../utils/ParsingUtils';
import { supportedYears } from '../../utils/Queries';
import { darkTheme, barChartColors } from '../../utils/StyleUtils';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styled from 'styled-components';

const CategorieShow = styled.section`
    background-color: ${darkTheme.sectionArea};
    border: 8px solid ${darkTheme.sectionArea};
    border-radius: 8px;
    margin-top: 10px;
    margin-left: 90px;
`;

const CategorieItemShow = styled.section`
    background-color: ${darkTheme.sectionAreaChild};
    border: 8px solid ${darkTheme.sectionAreaChild};
    border-radius: 8px;
    margin-top: 10px;
`;

const calculateColors = (min,max, d) => {
    if (d.value === min) {
        return barChartColors.minValue;
    } else if (d.value === max) {
        return barChartColors.maxValue;
    } else {
        return barChartColors.centerValue;
    }
}

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
            this.constructGraph();

            let categoricalData = getCategoriesComparisonByYear(this.props.data, this.props.city.toUpperCase());
            this.comparisonGraph(categoricalData);

        }
    }

    showText(d) {
        const value = parseMoney(d.data.value);
        const name = d.data.name;

        let data = getCategoriesComparisonByYear(this.props.data, name);

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
            let data = getCategoriesComparisonByYear(this.props.data, name);

            this.comparisonGraph(data);
            this.setState({
                textName: name,
                textValue: value
            });
        }
    }


    constructGraph() {
        d3.select("#circlePack").select("svg").remove();
       // var color = d3.scaleSequential([8, 0], d3.interpolateMagma);
       var color = d3.scaleOrdinal()
        .domain(0,1,2,3)
        .range(["#161D27","#9D3443","#D25C5A","#B2AFC4"]); 
       var format = d3.format(",d");
        var height = 400;
        var width = 400;
        var pack = data => d3.pack()
            .size([width - 2, height - 2])
            .padding(15)
            (d3.hierarchy(data)
                .sort((a, b) => b.value - a.value));


        const root = pack(this.props.data[0][2018][0].data);
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

    comparisonGraph(data) {
        let graphData = [];

        for (const key of Object.keys(supportedYears)) {
            let yearData = data[0][key];
            if (yearData[0]) {
                graphData.push({
                    year: key,
                    value: yearData[0].value
                });
            }


        }

        if (!graphData) {
            return;
        }

        d3.select("#comparisonGraph").select("svg").remove();


        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 90 },
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

        let max = d3.max(graphData, function (d) { return d.value; });
        let min = d3.min(graphData, function (d) { return d.value; });



        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(graphData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("y", function (d) { return y(d.value); })
            .attr("height", function (d) { return height - y(d.value); })
            .attr("fill", function(d) {
                return calculateColors(min, max, d);
             })
             .style("stroke", function(d)  {
                 return calculateColors(min, max, d);
             });

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "15px")
            .style("fill", "#FAFAFA");

        // add the y Axis
        svg.append("g")
            .attr("transform", "translate(10,0)")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#FAFAFA");
    }

    render() {
        return (
            <Container className="circlePack-root" style={{ color: darkTheme.text }}>
                <Row>
                    <Col md={6}>
                        <div id="circlePack" />
                    </Col>
                    <Col md={6}>
                        <div id="comparisonGraph" />
                        
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <p style={{marginLeft: "70px"}}>Legenda:</p>
                        <div style={{marginLeft: "70px"}}>
                            <div><Container style={{ 
                                width: "36px", 
                                height: "36px", 
                                backgroundColor: "#9D3443", 
                                borderRadius: "50%", 
                                display: 'inline-block',
                                marginRight: 10
                            }}><p style={{marginLeft: 46}}>Glavna kategorija </p></Container></div>
                            <div><Container style={{ 
                                width: "36px", 
                                height: "36px", 
                                backgroundColor: "#D25C5A", 
                                borderRadius: "50%", 
                                display: 'inline-block',
                                marginRight: 10
                            }}><p style={{marginLeft: 46}}>Pod kategorija</p></Container></div>
                            <div><Container style={{ 
                                width: "36px", 
                                height: "36px", 
                                backgroundColor: "#B2AFC4", 
                                borderRadius: "50%", 
                                display: 'inline-block',
                                marginRight: 10
                            }}><p style={{marginLeft: 46}}>Koncna kategorija   </p></Container></div>
                            <div><Container style={{ 
                                width: "36px", 
                                height: "36px", 
                                backgroundColor: "#161D27", 
                                borderRadius: "50%", 
                                display: 'inline-block',
                                marginRight: 10
                            }}><p style={{marginLeft: 46}}>Celotna občina</p></Container></div>
                            <div><Container style={{ 
                                width: "36px", 
                                height: "36px", 
                                backgroundColor: "#b2e1f9", 
                                borderRadius: "50%", 
                                display: 'inline-block',
                                marginRight: 10
                            }}><p style={{marginLeft: 46}}>Izbrana kategorija</p></Container></div>


                        </div>
                    </Col>
                    <Col md={6}>
                        <CategorieShow>
                            <CategorieItemShow>
                                <p>Kategorija: {this.state.textName} </p>
                            </CategorieItemShow>
                            <CategorieItemShow>
                                <p>Vrednost 2018:  {this.state.textValue} </p>
                            </CategorieItemShow>
                        </CategorieShow>

                    </Col>
                </Row>

            </Container>
        );

    }
}

export default CirclePack;