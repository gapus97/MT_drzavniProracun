import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { darkTheme } from '../utils/StyleUtils';
import BarChartCategories from './charts/BarChartCategories';
import Carousel from 'react-bootstrap/Carousel';
import { parseMoney, transformKindergardenText } from '../utils/ParsingUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faArrowCircleDown, faArrowsAltH, faChild } from '@fortawesome/free-solid-svg-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styled from 'styled-components';
import StateBudget from '../sites/StateBudget';

const MinMaxSection = styled.section`
    background-color: ${darkTheme.sectionAreaChild};
    border: 8px solid ${darkTheme.sectionAreaChild};
    border-radius: 8px;
    margin-top: 10px;
`;

const IndexComparisonSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${darkTheme.sectionAreaChild};
    margin-top: 10px;
    border: ${darkTheme.sectionAreaChild};
    border-radius: 8px;
`;

const KinderGardensSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${darkTheme.sectionArea};
    margin-top: 5px;
    margin-bottom: 5px;
    border: ${darkTheme.sectionArea};
    border-radius: 8px;
`;

const KinderGardenSection = styled.section`
    justify-content: center;
    align-items: center;
    background-color: ${darkTheme.sectionAreaChild};
    margin-top: 10px;
    margin-bottom: 10px;
    border: ${darkTheme.sectionAreaChild};
    border-radius: 8px;
`;

class StateIndexDataShower extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAdditionalInfo: false,
            additionalInfo: {},
            searchedStateData: {},
            comparisonStates: [],
            comparisonState: {},
            showStateBudget: false,
            showModalComparison: false,
            showModalSearchedState: false
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
        this.setState({
            showAdditionalInfo: true,
            additionalInfo: state
        });
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

            if (Object.keys(comparisonIndex).length === Object.keys(searchedStateIndex).length) {
                return (
                    <div> 
                    {
                        Object.keys(comparisonIndex).map((key, index) => {
                            return (
                                <div key={index} style={{
                                    backgroundColor: darkTheme.sectionArea, 
                                    border: `${darkTheme.sectionArea}`,
                                    borderRadius: 8,
                                    marginTop: 10}}> 
                                    <p>{key}</p>

                                        <OverlayTrigger overlay={
                                            <Tooltip style={{backgroundColor: '#FAFAFA', color: '#363537'}} id="tooltip-disabled tooltipComparison">
                                                <div>
                                                    <h5>Postopek izračuna</h5>
                                                    <p>vrednost = vrednostKategorije / populacija občine</p>
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
                                            <IndexComparisonSection>
                                                <p style={{margin: 0}}>{searchedStateIndex[key]}</p>
                                                {
                                                    searchedStateIndex[key] > comparisonIndex[key] ?
                                                    <FontAwesomeIcon icon={faAngleRight} size="2x" style={{marginLeft: 5, marginRight: 5}}/> :
                                                    <FontAwesomeIcon icon={faAngleLeft} size="2x" style={{marginLeft: 5, marginRight: 5}}/>
                                                }
                                                <p style={{margin: 0}}>{comparisonIndex[key]}</p>
                                            </IndexComparisonSection>
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
        let dataValues = data.values[0];

        if (
            Object.keys(dataValues).length > 0 && 
            Object.keys(dataValues).length > 0) {
            
            return (
                <div style={{marginTop: 10}}> 
                    <h4>Prikaz posameznih kategorij</h4>
                    {
                        Object.keys(dataValues).map((key, index) => {
                            let min = dataValues[key].min;
                            let max = dataValues[key].max;
                            return (
                                <div key={index} style={{
                                    border: `8px solid ${darkTheme.sectionArea}`, 
                                    marginTop: 10, 
                                    backgroundColor: darkTheme.sectionArea, 
                                    borderRadius: 8}}> 
                                    <h6>{key}</h6>

                                    <MinMaxSection>
                                       <h6>MIN</h6>
                                       <h6>{min.name}</h6>
                                       <p>{parseMoney(min.value)} €</p>
                                    </MinMaxSection>

                                    <MinMaxSection>
                                       <h6>MAX</h6>
                                       <h6>{max.name}</h6>
                                       <p>{parseMoney(max.value)} €</p>
                                    </MinMaxSection>
                                </div>
                            )
                        })
                    }
                </div>);
        }
    }

    onSearchedStateClick()  {
        console.log("Okkk searched state click");
        this.setState({showModalSearchedState: true, showModalComparison: false, showStateBudget: true});
    }

    onComparisonStateClick() {
        this.setState({showModalSearchedState: false, showModalComparison: true, showStateBudget: true});
    }

    hideStateModal = (toHide) => {
        console.log("tO hIDE STATE");
        this.setState({showStateBudget: false});
    }



    render() {
        const {
            comparisonState,
            searchedStateData,
            showStateBudget,
            showModalComparison,
            showModalSearchedState
        } = this.state;

        console.log("Show state budget: ", showModalSearchedState);

        const renderBarChart = (state, isOtherStates) => {
            let stateData = this.getCategoriesValue(state);

            if (stateData.length === 0) return;

            if(isOtherStates) {
                /* if is not main state then return carousel item */
                return (
                    <Carousel.Item id="stateIndexData" key={state.place} onClick={() => this.onComparisonStateClick()}>
                        <h3>#{ state.place } { state.name }</h3>
                        <h5> {state.population} preb.</h5>
                        <BarChartCategories data={stateData} stateName={state.name} indeks={state.place} />
                    </Carousel.Item>
                );
            } else {

                return (
                    <div id="stateIndexData" key={state.place} onClick={() => this.onSearchedStateClick()}>
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
                            <Col md={2} key={"secondCol"} className="justify-content-center text-center align-items-center" >
                                {
                                    Object.keys(comparisonState).length > 0 && 
                                    Object.keys(searchedStateData).length > 0 ?
                                    <KinderGardensSection>
                                        <KinderGardenSection>
                                            <FontAwesomeIcon icon={faChild} size="2x" style={{marginTop: 10}}/>
                                            <p style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>{transformKindergardenText(searchedStateData.values[1].length)}</p>
                                        </KinderGardenSection>
                                        <FontAwesomeIcon icon={faArrowsAltH} size="2x" style={{marginLeft: 5, marginRight:  5}} />
                                        <KinderGardenSection>
                                            <FontAwesomeIcon icon={faChild} size="2x"  style={{marginTop: 10}}/>
                                            <p style={{marginLeft: 10, marginRight: 10, marginTop: 10}}>{transformKindergardenText(comparisonState.values[1].length)} </p>
                                        </KinderGardenSection>
                                    </KinderGardensSection> : ''
                                }
                                <h3 style={{marginBottom: 10}}> Primerjava glede na število prebivalcev </h3>
                                <FontAwesomeIcon icon={faArrowCircleDown} size="8x" style={{marginLeft: 5, marginRight: 5}}/>
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
                    showModalComparison || showModalSearchedState ? 
                    showModalComparison ? 
                    <StateBudget 
                        city={comparisonState.name} 
                        showState={showStateBudget} 
                        onHideState={this.hideStateModal} /> :
                    <StateBudget 
                        city={searchedStateData.name} 
                        showState={showStateBudget} 
                        onHideState={this.hideStateModal} />
                    : ''
                }
            </Container>
        );
    }
}

export default StateIndexDataShower;