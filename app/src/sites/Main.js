import React from 'react';
import Maps from '../components/Maps';
import { states } from '../dataFetcher/FetchStates';
import States from '../components/States';
import BarChart from '../components/charts/BarChart';


class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: []
        };
    }

    componentDidMount() {
        this.getStates();
    }

    async getStates() {
        // save to state
        this.setState({
            stateData: await states()
        });
    }

    render() {

        return (
            <div id="Main">
                <Maps position={[45.9167, 14.2297]} zoom={150} data={this.state.stateData} />
                <States name={"miha"} />
                <BarChart />
            </div>
        );
        
    }
}

export default Main;