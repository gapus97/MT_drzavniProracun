import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



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
                        return <Col>
                            <p>Kategorija: {state}</p>
                            <p>Vrednost: { this.state.additionalInfo.values[0][state] }</p>
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
            <Container>
                <Container>
                    <p>Predlagane občine</p>
                </Container>
                <Row>
                  {this.props.data.map((state, i) => (
                      <Col key={i} className="indeks-item" onClick={e => this.onColumnClick(e, state)}>
                          <p>{state.name}</p>
                          <p>{state.normalisedIndex}</p>
                      </Col>
                  ))}
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