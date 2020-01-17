import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { darkTheme } from '../utils/StyleUtils';
import styled from 'styled-components';

const Kindergarden = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${darkTheme.sectionAreaChild};
    margin-top: 10px;
    margin-bottom: 10px;
    border: ${darkTheme.sectionAreaChild};
    border-radius: 8px;
    color: ${darkTheme.text};
`;

const Kindergardens = styled.section`
    background-color: ${darkTheme.sectionArea};
    margin-top: 10px;
    margin-bottom: 10px;
    border: ${darkTheme.sectionArea};
    border-radius: 8px;
    color: ${darkTheme.text};
    padding-right: 10px;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
`;

class ShowStateKindergardens extends React.Component {

    onKindergardenHide = () => {
        this.props.hideKindergarden(true);
    }


    renderKindergardens = (data) => {
        console.log("Data: ", data);
        return (
            <Kindergardens>
                {
                    data.map((kindergarden, index) => (
                        <Kindergarden key={kindergarden.id}>
                            <p>{index + 1}: {kindergarden.kindergarten_name}</p>
                        </Kindergarden>
                    ))
                }
            </Kindergardens>
        );
    }

    render() {  
        return (
            <Modal
                show={this.props.onKinderGardenShow}
                onHide={this.onKindergardenHide}>

                <Modal.Header closeButton>
                    <Modal.Title style={{color: darkTheme.body}}>Vrtci za {this.props.cityName} </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {
                        this.renderKindergardens(this.props.kindergardens)
                    }
                </Modal.Body>
            </Modal>
        );
    }
}

export default ShowStateKindergardens;