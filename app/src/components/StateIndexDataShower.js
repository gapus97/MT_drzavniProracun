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
            additionalInfo: {}
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

    render() {
        const {
            additionalInfo,
            showAdditionalInfo
        } = this.state;


        return (
            <Container >
                <Container>
                    <p>Predlagane občine</p>
                </Container>
                <Carousel showStatus={false} showIndicators={false}>
                  {this.props.data.map((state, i) => (
                      <div key={i} className="indeks-item" onClick={e => this.onColumnClick(e, state)}>
                          <p>{state.name}</p>
                          <p>{Number((state.normalisedIndex).toFixed(1))}</p>
                          <img src="" class="d-block w-100" ></img>
                      </div>
                  ))}
                </Carousel>

                {
                    additionalInfo && showAdditionalInfo ?
                    this.showInfo() : ''
                } 
            </Container>
        );
    }
}

export default StateIndexDataShower;