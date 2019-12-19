import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

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

    showStateIndexInfo = (stateData) => {
        console.log("Fun: ", stateData);
        if(stateData) {
            return (
                <Container>
                    {
                        Object.keys(stateData.index).map((key, i) => {
                            return <Row style={{width: `${stateData.index[key] * 0.1}px`, backgroundColor: 'red'}}>
                                <Col style={{color: 'white'}}>
                                    <p>{key}</p>
                                    <p>{stateData.index[key]}</p>
                                </Col>
                            </Row>
                        })
                    }
                </Container>
            );
        }
    }

    render() {
        const {
            additionalInfo,
            showAdditionalInfo,
            searchedStateData
        } = this.state;

        const {
            searchedStateIndexData
        } = this.props;

        console.log(searchedStateIndexData);
        
        const renderSearchedStateIndexInfo = (state) => {
            let maxValue = Math.max(...Object.values(state.index));
            console.log(maxValue);
            return (<Container>
                {
                    Object.keys(state.index).map((key, i) => {
                        console.log("Width: ", state.index[key] * 100 / maxValue);
                        return <Row key={i}>
                            <Col>
                                <p>{key}</p>
                                <p>{state.index[key]}</p>
                                <div style={{width: `${state.index[key] * 100 / maxValue}%`, height: '20px', backgroundColor: 'red'}}></div>
                            </Col>
                        </Row>
                    })
                }
            </Container>
            );
        };

        /* md={6} each col is 50% width */
        return (
            <Container className="mainIndexShower">
                <Row>
                    <Col md={6}>
                        <h4>Izbrana občina: </h4>
                        <h3>{ searchedStateIndexData.name }</h3>
                        {
                            Object.keys(searchedStateIndexData).length > 0 ? 
                            renderSearchedStateIndexInfo(searchedStateIndexData) : ''
                        }
                    </Col>

                    <Col md={6}>
                        <Carousel showStatus={false} showIndicators={false}>
                            {this.props.data.map((state, i) => (
                                <div key={i} className="indeks-item" onClick={e => this.onColumnClick(e, state)}>
                                    <p>{state.name}</p>
                                    <p>{Number((state.normalisedIndex).toFixed(1))}</p>
                                    <img src="" className="d-block w-100" ></img>
                                </div>
                            ))}
                        </Carousel>
                    </Col>
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