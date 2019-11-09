import React from 'react';
import StatesChart from '../components/charts/StatesChart';


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
                <StatesChart />
            </div>
        );
        
    }
}

export default About;