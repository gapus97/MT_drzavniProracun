import React from 'react';
import Spinner from 'react-bootstrap/Spinner';


class LoadingPage extends React.Component {

    componentDidMount() {
        
    }

    render() {
        // https://react-bootstrap.github.io/components/spinners/
        return (
            <Spinner animation="border" role="status" variant="primary">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }
}

export default LoadingPage;