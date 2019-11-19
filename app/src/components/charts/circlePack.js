import React from 'react';
import * as d3 from 'd3';
import nextId from "react-id-generator";

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
       var height = 975;
       var width=this.height;
       var DOM=nextId();
       var color = d3.scaleSequential([8, 0], d3.interpolateMagma);
       var format = d3.format(",d");
       var pack = data => d3.pack()
            .size([this.width / 2, this.height / 2])
            .padding(3)
          (d3.hierarchy(this.props.data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))
        // replace this with real API-data
        var el_id = 'zoomedTreeMap';
         const root = pack(this.props.data);

          const svg = d3.select("#zoomedTreeMap").append("svg")
              .attr("viewBox", [0, 0, this.width, this.height])
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
              .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

          node.append("circle")
              .attr("r", d => d.r)
              .attr("fill", d => color(d.height));

          const leaf = node.filter(d => !d.children);

          leaf.select("circle")
              .attr("id", d => (d.leafUid = DOM+"shadow").id);

          leaf.append("clipPath")
              .attr("id", d => (d.clipUid = DOM+"desdes").id)
            .append("use")
              .attr("xlink:href", d => d.leafUid.href);



          node.append("title")
              .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    }

    render() {
        return (
            <div id="zoomedTreeMap">
            </div>
        );

    }
}

export default ZoomedTreeMap;