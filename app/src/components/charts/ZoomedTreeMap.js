import React from 'react';
import * as d3 from 'd3';


class ZoomedTreeMap extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

   
    constructGraph() {

        // replace this with real API-data
        var d = {
            "id": 11.0,
            "children": [
                {
                    "name": "JAVNA UPRAVA",
                    "children": [
                        {
                            "name": "Dejavnosti izvr\u0161ilnih in zakonodajnih organov, ter dejavnosti s podro\u010dja finan\u010dnih in fiskalnih ter zunanjih zadev",
                            "children": [
                                {
                                    "name": "Dejavnosti izvr\u0161ilnih in zakonodajnih organov",
                                    "value": 3900105.41
                                },
                                {
                                    "name": "Dejavnosti s podro\u010dja finan\u010dnih in fiskalnih zadev",
                                    "value": 79292.34
                                },
                                {
                                    "name": "Dejavnosti s podro\u010dja zunanjih zadev",
                                    "value": 45069.14
                                }
                            ],
                            "value": 4024466.89
                        },
                        {
                            "name": "Gospodarska pomo\u010d drugim dr\u017eavam",
                            "children": [
                                {
                                    "name": "Gospodarska pomo\u010d drugim dr\u017eavam",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Splo\u0161ne zadeve",
                            "children": [
                                {
                                    "name": "Splo\u0161ne kadrovske zadeve",
                                    "value": 0.0
                                },
                                {
                                    "name": "Razvojno na\u010drtovanje in statisti\u010dne storitve",
                                    "value": 0.0
                                },
                                {
                                    "name": "Druge splo\u0161ne zadeve in storitve",
                                    "value": 1863540.76
                                }
                            ],
                            "value": 1863540.76
                        },
                        {
                            "name": "Raziskave in razvoj na podro\u010dju javne uprave",
                            "children": [
                                {
                                    "name": "Raziskave in razvoj na podro\u010dju javne uprave",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Druge dejavnosti javne uprave",
                            "children": [
                                {
                                    "name": "Druge dejavnosti javne uprave",
                                    "value": 192582.17
                                }
                            ],
                            "value": 192582.17
                        },
                        {
                            "name": "Servisiranje javnega dolga",
                            "children": [
                                {
                                    "name": "Servisiranje javnega dolga dr\u017eave",
                                    "value": 204080.05
                                }
                            ],
                            "value": 204080.05
                        },
                        {
                            "name": "Splo\u0161ni transferi med javnofinan\u010dnimi institucijami na razli\u010dnih ravneh dr\u017eave",
                            "children": [
                                {
                                    "name": "Splo\u0161ni transferi med javnofinan\u010dnimi institucijami  na razli\u010dnih ravneh dr\u017eave",
                                    "value": 284956.01
                                }
                            ],
                            "value": 284956.01
                        }
                    ],
                    "value": 6569625.88
                },
                {
                    "name": "OBRAMBA",
                    "children": [
                        {
                            "name": "Civilna za\u0161\u010dita",
                            "children": [
                                {
                                    "name": "Civilna za\u0161\u010dita",
                                    "value": 490365.03
                                }
                            ],
                            "value": 490365.03
                        }
                    ],
                    "value": 490365.03
                },
                {
                    "name": "JAVNI RED IN VARNOST",
                    "children": [
                        {
                            "name": "Policija",
                            "children": [
                                {
                                    "name": "Policija",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Protipo\u017earna varnost",
                            "children": [
                                {
                                    "name": "Protipo\u017earna varnost",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        }
                    ],
                    "value": 0.0
                },
                {
                    "name": "GOSPODARSKE DEJAVNOSTI",
                    "children": [
                        {
                            "name": "Dejavnosti s podro\u010dja splo\u0161nih gospodarskih zadev ter zadev, povezanih z delom",
                            "children": [
                                {
                                    "name": "Dejavnosti s podro\u010dja splo\u0161nih gospodarskih in trgovinskih zadev",
                                    "value": 200319.19
                                },
                                {
                                    "name": "Dejavnosti s podro\u010dja splo\u0161nih zadev, povezanih z delom in zaposlovanjem",
                                    "value": 0.0
                                }
                            ],
                            "value": 200319.19
                        },
                        {
                            "name": "Kmetijstvo, gozdarstvo, ribi\u0161tvo in lov",
                            "children": [
                                {
                                    "name": "Kmetijstvo",
                                    "value": 0.0
                                },
                                {
                                    "name": "Gozdarstvo",
                                    "value": 12530.86
                                },
                                {
                                    "name": "Ribi\u0161tvo in lov",
                                    "value": 0.0
                                }
                            ],
                            "value": 12530.86
                        },
                        {
                            "name": "Pridobivanje in distribucija energetskih surovin",
                            "children": [
                                {
                                    "name": "Pridobivanje in distribucija nafte in zemeljskega plina",
                                    "value": 22285.29
                                },
                                {
                                    "name": "Pridobivanje in distribucija elektri\u010dne energije",
                                    "value": 0.0
                                },
                                {
                                    "name": "Pridobivanje in distribucija druge energije",
                                    "value": 24761.35
                                }
                            ],
                            "value": 47046.64
                        },
                        {
                            "name": "Promet",
                            "children": [
                                {
                                    "name": "Cestni promet",
                                    "value": 237803.35
                                },
                                {
                                    "name": "Vodni promet",
                                    "value": 0.0
                                },
                                {
                                    "name": "\u017delezni\u0161ki promet",
                                    "value": 0.0
                                },
                                {
                                    "name": "Zra\u010dni promet",
                                    "value": 0.0
                                }
                            ],
                            "value": 237803.35
                        },
                        {
                            "name": "Komunikacije",
                            "children": [
                                {
                                    "name": "Komunikacije",
                                    "value": 223014.73
                                }
                            ],
                            "value": 223014.73
                        },
                        {
                            "name": "Druge gospodarske dejavnosti",
                            "children": [
                                {
                                    "name": "Turizem",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Druge dejavnosti s podro\u010dja gospodarskih zadev",
                            "children": [
                                {
                                    "name": "Druge dejavnosti s podro\u010dja gospodarskih zadev",
                                    "value": 1176401.56
                                }
                            ],
                            "value": 1176401.56
                        }
                    ],
                    "value": 1897116.33
                },
                {
                    "name": "VARSTVO OKOLJA",
                    "children": [
                        {
                            "name": "Zbiranje in ravnanje z odpadki",
                            "children": [
                                {
                                    "name": "Zbiranje in ravnanje z odpadki",
                                    "value": 472258.58
                                }
                            ],
                            "value": 472258.58
                        },
                        {
                            "name": "Ravnanje z odpadno vodo",
                            "children": [
                                {
                                    "name": "Ravnanje z odpadno vodo",
                                    "value": 24903.61
                                }
                            ],
                            "value": 24903.61
                        },
                        {
                            "name": "Zmanj\u0161evanje onesna\u017eevanja",
                            "children": [
                                {
                                    "name": "Zmanj\u0161evanje onesna\u017eevanja",
                                    "value": 7860.33
                                }
                            ],
                            "value": 7860.33
                        },
                        {
                            "name": "Varstvo biolo\u0161ke raznovrstnosti in krajine",
                            "children": [
                                {
                                    "name": "Varstvo biolo\u0161ke raznovrstnosti in krajine",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Druge dejavnosti s podro\u010dja varstva okolja",
                            "children": [
                                {
                                    "name": "Druge dejavnosti s podro\u010dja varstva okolja",
                                    "value": 256044.73
                                }
                            ],
                            "value": 256044.73
                        }
                    ],
                    "value": 761067.25
                },
                {
                    "name": "STANOVANJSKA DEJAVNOST IN PROSTORSKI RAZVOJ",
                    "children": [
                        {
                            "name": "Stanovanjska dejavnost",
                            "children": [
                                {
                                    "name": "Stanovanjska dejavnost",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Dejavnosti na podro\u010dju prostorskega na\u010drtovanja in razvoja",
                            "children": [
                                {
                                    "name": "Dejavnosti na podro\u010dju prostorskega na\u010drtovanja in razvoja",
                                    "value": 169274.89
                                }
                            ],
                            "value": 169274.89
                        },
                        {
                            "name": "Oskrba z vodo",
                            "children": [
                                {
                                    "name": "Oskrba z vodo",
                                    "value": 112637.38
                                }
                            ],
                            "value": 112637.38
                        },
                        {
                            "name": "Cestna razsvetljava",
                            "children": [
                                {
                                    "name": "Cestna razsvetljava",
                                    "value": 569223.52
                                }
                            ],
                            "value": 569223.52
                        }
                    ],
                    "value": 851135.79
                },
                {
                    "name": "ZDRAVSTVO",
                    "children": [
                        {
                            "name": "Oskrba z zdravili, drugimi farmacevtskimi izdelki in ortopedskimi pripomo\u010dki",
                            "children": [
                                {
                                    "name": "Oskrba z zdravili",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Izvenbolni\u0161ni\u010dne zdravstvene storitve",
                            "children": [
                                {
                                    "name": "Splo\u0161ne zdravstvene storitve",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Bolni\u0161ni\u010dne zdravstvene storitve",
                            "children": [
                                {
                                    "name": "Storitve splo\u0161nih bolni\u0161nic",
                                    "value": 0.0
                                },
                                {
                                    "name": "Storitve specializiranih bolni\u0161nic",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Storitve splo\u0161nega zdravstvenega varstva",
                            "children": [
                                {
                                    "name": "Storitve splo\u0161nega zdravstvenega varstva",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        }
                    ],
                    "value": 0.0
                },
                {
                    "name": "REKREACIJA, KULTURA IN DEJAVNOSTI NEPROFITNIH ORGANIZACIJ, DRU\u0160TEV, ZDRU\u017dENJ IN DRUGIH INSTITUCIJ",
                    "children": [
                        {
                            "name": "Dejavnosti na podro\u010dju \u0161porta in rekreacije",
                            "children": [
                                {
                                    "name": "Dejavnosti na podro\u010dju \u0161porta in rekreacije",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Kulturne dejavnosti",
                            "children": [
                                {
                                    "name": "Kulturne dejavnosti",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Dejavnosti radia in televizije ter zalo\u017eni\u0161tva",
                            "children": [
                                {
                                    "name": "Dejavnosti radia in televizije ter zalo\u017eni\u0161tva",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Dejavnosti neprofitnih organizacij, dru\u0161tev, zdru\u017eenj in drugih institucij",
                            "children": [
                                {
                                    "name": "Dejavnosti neprofitnih organizacij, dru\u0161tev, zdru\u017eenj in drugih institucij",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        }
                    ],
                    "value": 0.0
                },
                {
                    "name": "IZOBRA\u017dEVANJE",
                    "children": [
                        {
                            "name": "Pred\u0161olska vzgoja in osnovno\u0161olsko izobra\u017eevanje",
                            "children": [
                                {
                                    "name": "Pred\u0161olska vzgoja",
                                    "value": 25660.47
                                },
                                {
                                    "name": "Osnovno\u0161olsko izobra\u017eevanje",
                                    "value": 56169.69
                                }
                            ],
                            "value": 81830.16
                        },
                        {
                            "name": "Srednje\u0161olsko izobra\u017eevanje",
                            "children": [
                                {
                                    "name": "Srednje izobra\u017eevanje",
                                    "value": 0.0
                                },
                                {
                                    "name": "Srednje poklicno izobra\u017eevanje",
                                    "value": 0.0
                                },
                                {
                                    "name": "Srednje strokovno izobra\u017eevanje",
                                    "value": 0.0
                                },
                                {
                                    "name": "Srednje splo\u0161no izobra\u017eevanje",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Vi\u0161je\u0161olsko izobra\u017eevanje",
                            "children": [
                                {
                                    "name": "Vi\u0161je\u0161olsko izobra\u017eevanje",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Visoko\u0161olsko izobra\u017eevanje",
                            "children": [
                                {
                                    "name": "Visoko\u0161olsko izobra\u017eevanje",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Izobra\u017eevanje, ki ga ni mogo\u010de opredeliti po stopnjah",
                            "children": [
                                {
                                    "name": "Izobra\u017eevanje, ki ga ni mogo\u010de opredeliti po stopnjah",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Podporne storitve pri izobra\u017eevanju",
                            "children": [
                                {
                                    "name": "Podporne storitve pri izobra\u017eevanju",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        }
                    ],
                    "value": 81830.16
                },
                {
                    "name": "SOCIALNA VARNOST",
                    "children": [
                        {
                            "name": "Varstvo obolelih in invalidnih oseb",
                            "children": [
                                {
                                    "name": "Varstvo invalidnih oseb",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Varstvo otrok in dru\u017eine",
                            "children": [
                                {
                                    "name": "Varstvo otrok in dru\u017eine",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Zagotavljanje socialne varnosti socialno ogro\u017eenih in socialno izklju\u010denih kategorij prebivalstva",
                            "children": [
                                {
                                    "name": "Zagotavljanje socialne varnosti socialno ogro\u017eenih in socialno izklju\u010denih kategorij prebivalstva",
                                    "value": 0.0
                                }
                            ],
                            "value": 0.0
                        },
                        {
                            "name": "Druge dejavnosti na podro\u010dju socialnega varstva",
                            "children": [
                                {
                                    "name": "Druge dejavnosti na podro\u010dju socialne varnosti",
                                    "value": 50000.0
                                }
                            ],
                            "value": 50000.0
                        }
                    ],
                    "value": 50000.0
                },
                {
                    "name": "SKUPAJ VSE DEJAVNOSTI(OD 01 DO 10)",
                    "children": [],
                    "value": 10701140.440000001
                }
            ],
            "name": "  CELJE",
            "value": 10701140.440000001
        };
        var el_id = 'zoomedTreeMap';
        var obj = document.getElementById(el_id);
        var divWidth = 1200;
        var margin = {top: 30, right: 0, bottom: 20, left: 0},
            width = divWidth -25,
            height = 600 - margin.top - margin.bottom,
            formatNumber = d3.format(","),
            transitioning;


        // sets x and y scale to determine size of visible boxes
        var x = d3.scaleLinear()
            .domain([0, width])
            .range([0, width]);
        var y = d3.scaleLinear()
            .domain([0, height])
            .range([0, height]);
        var treemap = d3.treemap()
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
       
        var root = d3.hierarchy(d);
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
                .text(name(d));
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
                .enter().
                append("g");
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
                .enter().append("rect")
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
                .append("xhtml:div")
                .attr("dy", ".75em")
                .html(function (d) {
                    return '' +
                        '<p class="title"> ' + d.data.name + '</p>' +
                        '<p>' + formatNumber(d.value) + '</p>'
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
        console.log("Props data: ", this.props.data);
        if(this.props.data !== undefined) {
            this.constructGraph();
        }
        //this.constructGraph();
        return (
            <div id="zoomedTreeMap">
            </div>
        );
        
    }
}

export default ZoomedTreeMap;