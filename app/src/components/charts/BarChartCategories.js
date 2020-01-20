import React from 'react';
import * as d3 from 'd3';
import { parseMoney } from '../../utils/ParsingUtils';
import styled from 'styled-components';
import { barChartColors, darkTheme } from '../../utils/StyleUtils';

const ToolTipStyle = styled.section`
    position: absolute;
    width: 200px;
    height: auto;
    padding: 10px;
    background-color: white;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    -webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
    pointer-events: none;
`;

let calculateColors = (d, averageForCategories) => {
    if (d.value > (averageForCategories[d.name] - (averageForCategories[d.name] * 0.1)) &&
        (averageForCategories[d.name] + (averageForCategories[d.name] * 0.1)) > d.value) {
        return barChartColors.centerValue;
    }
    else if (averageForCategories[d.name] + (averageForCategories[d.name] * 0.1) < d.value) {
        return barChartColors.maxValue;
    } else {
        return barChartColors.minValue;
    }
}

class BarChartCategories extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barChartName: `barChartCategories-${this.props.indeks}`,
            barChartToolTip: `tooltip-${this.props.indeks}`
        };
    }

    componentDidMount() {
        this.constructGraph(this.props.data, this.props.averageData);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data && prevProps.averageData !== this.props.averageData) {
            console.log("AVG DATA: ", this.props.averageData);
            this.constructGraph(this.props.data, this.props.averageData);
        }
        if (prevProps.indeks !== this.props.indeks) {
            this.setState({
                barChartName: `barChartCategories-${this.props.indeks}`,
                barChartToolTip: `tooltip-${this.props.indeks}`
            });
        }

    }
    constructGraph = async (data, averageData) => {
        const averageForCategories = averageData;


        d3.select(`#${this.state.barChartName}`).select("svg").remove();
        if (data.length === 0) return;


        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 0, bottom: 50, left: 100 },
            width = 400 - margin.left - margin.right, //350, 250
            height = 250 - margin.top - margin.bottom;


        let barChartToolTip = this.state.barChartToolTip;

        var rangeOfTicks = [];
        var exp = 10000;
        for (var i = 1; i < 5; i++) {
            rangeOfTicks.push(d3.max(data, d => d.value) / exp);
            exp = exp / Math.pow(10, 1);
        }
        rangeOfTicks.push(d3.max(data, d => d.value));

        // append the svg object to the body of the page
        var svg = d3.select(`#${this.state.barChartName}`)
            .append("svg")
            .attr("width", "100%")
            .attr("height", height + margin.top + margin.bottom + 20)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scalePow()
            .exponent(0.3)
            .domain([0, d3.max(data, d => d.value)])
            .range([0, width]);

        //https://medium.com/@ghenshaw.work/customizing-axes-in-d3-js-99d58863738b
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(6).tickValues(rangeOfTicks))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .style("fill", "#FAFAFA");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function (d) { return d.name; }))
            .padding(0.1);
        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", "12px")
            .style("fill", "#FAFAFA");

        //Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", function (d) { return y(d.name); })
            .attr("width", function (d) { return x(d.value); })
            .attr("height", y.bandwidth())
            .attr("fill", function (d) {
                return calculateColors(d, averageForCategories);
            })
            .style("stroke", function (d) {
                return calculateColors(d, averageForCategories);
            })
            .attr("rx", 8)
            .on("mouseover", function (d) {
                var xPosition = parseFloat(d3.select(this).attr("x")) + y.bandwidth() / 2;
                var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

                d3.select(`#${barChartToolTip}`)
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    .select(`#${barChartToolTip}value`)
                    .text(`${parseMoney(d.value / 1000)} tisoč `);


                d3.select(`#${barChartToolTip}`).classed("hidden", false);

            })
            .on("mouseout", function () {
                // hide toooltip
                d3.select(`#${barChartToolTip}`).classed("hidden", true);
            });


    }


    render() {
        return (
            <div style={{ marginLeft: 170 }}>
                <div id={this.state.barChartName} />
                <ToolTipStyle id={this.state.barChartToolTip} className="hidden">
                    <p style={{ color: darkTheme.body, fontWeight: 'bold' }}><span id={`${this.state.barChartToolTip}value`}>100</span>€</p>
                </ToolTipStyle>
            </div>
        );
    }
}

export default BarChartCategories;