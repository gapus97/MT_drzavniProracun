import React from 'react';
import StatesChart from '../components/charts/ZoomedTreeMap';


class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: []
        };
    }

    componentDidMount() {
    }

    render() {

        return (
            <div>
                <p>About this project</p>
            
            </div>
        );
        
    }
}

export default About;