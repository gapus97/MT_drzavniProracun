import React from 'react';
import * as d3 from 'd3';
//import nextId from "react-id-generator";

class CirclePack extends React.Component {

    constructor(props) {
        super(props);
           this.height = 975;
           this.width=this.height;
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
       //var DOM=nextId();
       console.log(this.props);
       debugger;
       var color = d3.scaleSequential([8, 0], d3.interpolateMagma);
       var format = d3.format(",d");
       var pack = data => d3.pack()
            .size([this.width / 2, this.height / 2])
            .padding(3)
          (d3.hierarchy(data)
            .sort((a, b) => b.value - a.value))
        // replace this with real API-data
        var el_id = 'circlePack';
         const root = pack(this.props.data[0][2018][0]);

          const svg = d3.select("#circlePack").append("svg")
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

    render() {
        return (
            <div id="circlePack">
            </div>
        );

    }
}

export default CirclePack;