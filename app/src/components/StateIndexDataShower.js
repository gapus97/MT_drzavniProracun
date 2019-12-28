import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "react-responsive-carousel/lib/styles/carousel.min.css";
//import { Carousel } from 'react-responsive-carousel';
import Chart from "react-google-charts";
import { darkTheme } from '../utils/StyleUtils';
import BarChartCategories from './charts/BarChartCategories';
import Carousel from 'react-bootstrap/Carousel';
import { parseMoney } from '../utils/ParsingUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import Overlay from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class StateIndexDataShower extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAdditionalInfo: false,
            additionalInfo: {},
            searchedStateData: {},
            comparisonStates: [],
            comparisonState: {}
        };
    }

    componentDidMount() {
        
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.searchedStateIndexData !== this.props.searchedStateIndexData) {
            this.setState({
                searchedStateData: this.props.searchedStateIndexData
            });
        }
        if(prevProps.data !== this.props.data) {
            let comparisonStates = this.props.data.filter(state => state.name !== this.props.searchedStateIndexData.name);
            if(comparisonStates.length > 0) {
                this.setState({
                    comparisonStates: comparisonStates,
                    comparisonState: comparisonStates[0]
                });
            }
        }
    }


    onColumnClick = (e, state) => {
        console.log(state);
        this.setState({
            showAdditionalInfo: true,
            additionalInfo: state
        });
    }

    showInfo = () => {
        return (
            <Container>
                <Row>
                    {Object.keys(this.state.additionalInfo.values[0]).map((state, i) => {
                        console.log(state);
                        return <Col class={"col-md-offset-2"} style={{backgroundColor:'#282D33',margin:'0 2.5%',width:'20%', marginBottom:'20px'}}>
                            <p style={{color:'white'}}>Kategorija: {state}</p>
                            <p style={{color:'white'}}>Vrednost: { Number((this.state.additionalInfo.values[0][state]).toFixed(2))}</p>
                        </Col> 
                    })

                    }
                </Row>
            </Container>
        );
    }


    getCategoriesValue = (stateData) => {
        // parse categories for graph rendering
        let categories = [];
        if (Object.keys(stateData.values[0]).length > 0) {
            for(let key of Object.keys(stateData.values[0])) {
                categories.push({
                    "name": key,
                    "value": stateData.values[0][key].value
                });
                
            }
        }
        return categories;
    }

    onCarouselItemSelect = (eventKey, direction, event) => {
        console.log("Key: ", eventKey);
        console.log("Direction: ", direction);
        console.log("Event", event);
        this.setState({
            comparisonState: this.state.comparisonStates[eventKey]
        });
    }

    getComparisonTable = () => {
        const {
            comparisonState,
            searchedStateData
        } = this.state;
        if (Object.keys(comparisonState).length > 0 && Object.keys(searchedStateData).length > 0) {
            let comparisonIndex = comparisonState.index;
            let searchedStateIndex = searchedStateData.index;
            let comparisonValues = comparisonState.values[0];
            let searchedStateValues = searchedStateData.values[0];
            console.log(comparisonState);

            if (Object.keys(comparisonIndex).length === Object.keys(searchedStateIndex).length) {
                return (
                    <div> 
                    {
                        Object.keys(comparisonIndex).map((key, index) => {
                            return (
                                <div key={index}> 
                                    <p>{key}</p>

                                        <OverlayTrigger overlay={
                                            <Tooltip style={{backgroundColor: '#FAFAFA', color: '#363537'}} id="tooltip-disabled tooltipComparison">
                                                <div>
                                                    <p>Postopek izračuna: vrednost = vrednostKategorije / populacija občine</p>
                                                    <div style={{display: 'flex'}}>
                                                        <p style={{margin: 0}}>{searchedStateIndex[key]}</p>
                                                        <p>=</p>
                                                        <p style={{margin: 0}}>{parseMoney(searchedStateValues[key].value)} / {searchedStateData.population}</p>
                                                    </div>
                                                    <div style={{display: 'flex'}}>
                                                        <p style={{margin: 0}}>{comparisonIndex[key]}</p>
                                                        <p>=</p>
                                                        <p style={{margin: 0}}>{parseMoney(comparisonValues[key].value)} / {comparisonState.population}</p>
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        }>
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <p style={{margin: 0}}>{searchedStateIndex[key]}</p>
                                                {
                                                    searchedStateIndex[key] > comparisonIndex[key] ?
                                                    <FontAwesomeIcon icon={faAngleRight} size="2x" style={{marginLeft: 5, marginRight: 5}}/> :
                                                    <FontAwesomeIcon icon={faAngleLeft} size="2x" style={{marginLeft: 5, marginRight: 5}}/>
                                                }
                                                <p style={{margin: 0}}>{comparisonIndex[key]}</p>
                                            </div>
                                        </OverlayTrigger>

                                </div>
                            )
                        })
                    }
                    </div>);
            }
        }

    }

    getStateStatistics = (data) => {
        console.log("State statistics data: ", data);
        let dataValues = data.values[0];

        if (
            Object.keys(dataValues).length > 0 && 
            Object.keys(dataValues).length > 0) {
            
            return (
                <div style={{marginTop: 10}}> 
                    {
                        Object.keys(dataValues).map((key, index) => {
                            let min = dataValues[key].min;
                            let max = dataValues[key].max;
                            return (
                                <div key={index} style={{border: "1px solid", borderColor: '#FAFAFA', marginTop: 10}}> 
                                    <h6>{key}</h6>

                                    <div>
                                       <h6>MIN</h6>
                                       <h6>{min.name}</h6>
                                       <p>{parseMoney(min.value)}</p>
                                    </div>

                                    <div>
                                       <h6>MAX</h6>
                                       <h6>{max.name}</h6>
                                       <p>{parseMoney(max.value)}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>);
        }
    }



    render() {
        const {
            additionalInfo,
            showAdditionalInfo,
            comparisonState,
            searchedStateData
        } = this.state;

        const {
            searchedStateIndexData
        } = this.props;

        const renderBarChart = (state, isOtherStates) => {
            let stateData = this.getCategoriesValue(state);

            if (stateData.length === 0) return;

            if(isOtherStates) {
                /* if is not main state then return carousel item */
                return (
                    <Carousel.Item key={state.place}>
                        <h3>#{ state.place } { state.name }</h3>
                        <h5> {state.population} preb.</h5>
                        <BarChartCategories data={stateData} stateName={state.name} indeks={state.place} />
                    </Carousel.Item>
                );
            } else {

                return (
                    <div key={state.place}>
                        <h3>#{ state.place } { state.name }</h3>
                        <h5> {state.population} preb.</h5>
                        <BarChartCategories data={stateData} stateName={state.name} indeks={state.place} />
                    </div>
                );
            }
        };

        this.getComparisonTable();
    
        /* md={6} each col is 50% width */
        return (
            <Container className="mainIndexShower" fluid={true}>
                <Row>
                    {
                        Object.keys(this.state.searchedStateData).length > 0 ? 
                        [ 
                            <Col md={5} key={"firstCol"}>
                                {
                                    renderBarChart(this.state.searchedStateData, false)
                                }
                            </Col>,
                            <Col md={2} key={"secondCol"} className="d-flex justify-content-center text-center align-items-center" >
                                <h3> Primerjava glede na število prebivalcev </h3>
                            </Col>,
                            <Col md={5} key={"thirdCol"}>
                                { <Carousel 
                                    className="mainCarousel" 
                                    wrap={false} 
                                    indicators={false}
                                    interval={null} 
                                    onSelect={this.onCarouselItemSelect}
                                    style={{backgroundColor: darkTheme.body}}>

                                        {this.state.comparisonStates.map((state, i) => (
                                            renderBarChart(state, true)
                                        ))}
                                </Carousel>  
                                }
                            </Col>
                        ]: ''
                    }
                          
                </Row>
                <Row style={{marginTop: 20}}>
                {
                    Object.keys(comparisonState).length > 0 &&
                    Object.keys(searchedStateData).length > 0 ?
                    [ <Col md={4} key={"firstCol"}>
                    {
                        this.getStateStatistics(searchedStateData)
                    }
                    </Col>,
                    <Col md={4}  key={"secondCol"}>
                        {
                            this.getComparisonTable()
                        }
                    </Col>,
                    <Col md={4} key={"thirdCol"}>
                        {
                            this.getStateStatistics(comparisonState)
                        }
                    </Col>] : ''
                }
                   
                </Row>

                {
                    additionalInfo && showAdditionalInfo ?
                    this.showInfo() : ''
                } 
            </Container>
        );
    }
}

export default StateIndexDataShower;