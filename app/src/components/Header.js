import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfo } from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class Header extends React.Component {

    render() {
        return (
            <Container className="App-header" fluid={true}>
                <Row>
                    <Col md={6}>
                        <FontAwesomeIcon icon={faHome} />
                        <a href="/" className="header-item">Domov</a>
                    </Col>
                    <Col md={6}>
                        <FontAwesomeIcon icon={faInfo} />
                        <a href="/about" className="header-item">About</a>
                    </Col>
                </Row>
            </Container>
           
        );

        /*<header className="App-header">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                
                </ul>
            </header>*/
    }
}

export default Header;