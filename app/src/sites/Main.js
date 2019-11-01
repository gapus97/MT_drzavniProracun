import React from 'react';
import Maps from '../components/Maps';
import { states } from '../dataFetcher/FetchStates';


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
        console.log(this.state.stateData);

        /*
            TODO:
            show map, for some reason it doesnt showing
        */
        return (
            <div>
                <p>Ok</p>
                <Maps position={[45.9167, 14.2297]} zoom={150} data={this.state.stateData} />
            </div>
        );
        
    }
}

export default Main;