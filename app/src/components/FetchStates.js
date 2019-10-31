import React from 'react';
import { fetchJSON } from '../utils/FetchUtils';



class FetchStates extends React.Component {

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
        let data = await fetchJSON("http://localhost:9200/states/_search", "GET");
        let statesData = [];

        console.log(data);

        data.hits.hits.forEach(element => {
            let state = element._source;
            statesData.push(state);
        });

        // save to state
        this.setState({
            stateData: statesData
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

export default FetchStates;