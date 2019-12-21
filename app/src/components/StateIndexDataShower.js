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

class StateIndexDataShower extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAdditionalInfo: false,
            additionalInfo: {},
            searchedStateData: {}
        };
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
                    "value": stateData.values[0][key]
                });
                
            }
        }
        return categories;
    }



    render() {
        const {
            additionalInfo,
            showAdditionalInfo
        } = this.state;

        const {
            searchedStateIndexData
        } = this.props;

        

        console.log(searchedStateIndexData);

        const renderBarChart = (state, isOtherStates) => {
            let stateData = this.getCategoriesValue(state);

            if(isOtherStates) {
                /* if is not main state then return carousel item */
                return (
                    <Carousel.Item key={state.place}>
                        <h3>#{ state.place } { state.name }</h3>
                        <BarChartCategories data={stateData} stateName={state.name} indeks={state.place} />
                    </Carousel.Item>
                );
            } else {

                return (
                    <div key={state.place}>
                        <h3>#{ state.place } { state.name }</h3>
                        <BarChartCategories data={stateData} stateName={state.name} indeks={state.place} />
                    </div>
                );
            }
        };
    
        /* md={6} each col is 50% width */
        return (
            <Container className="mainIndexShower" fluid={true}>
                <Row>
                    {
                        Object.keys(searchedStateIndexData).length > 0 ? 
                        [ 
                            <Col md={6} key={"firstCol"}>
                                {
                                    renderBarChart(searchedStateIndexData, false)
                                }
                            </Col>,
                            <Col md={6} key={"secondCol"}>
                                { <Carousel className="mainCarousel" indicators={false} style={{backgroundColor: darkTheme.body}}>
                                    {this.props.data.filter(state => state.name !== searchedStateIndexData.name).map((state, i) => (
                                        renderBarChart(state, true)
                                    ))}
                                </Carousel>  
                                }
                            </Col>
                        ]: ''
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