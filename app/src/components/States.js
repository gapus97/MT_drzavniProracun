import React from 'react';
import { states } from '../dataFetcher/FetchStates';


class States extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
        };
    }

    componentDidMount() {
        this.getStates();
    }

    async getStates() {
        // save to state
        let statesAndCoordinates = await states();
        this.setState({
            stateData: statesAndCoordinates
        });
    }

    parseStates() { 
        return (
            <ul>
                {
                    this.state.stateData.map(element => (
                        <li key={element.id}>{element.id} {element.name}</li>
                    ))
                }
            </ul>
        );
    }

    render() {
        return (
            <div>
                <h1>Hello, {this.props.name}</h1>

                {
                    this.parseStates()
                }
            </div>
        );
    }
}

export default States;