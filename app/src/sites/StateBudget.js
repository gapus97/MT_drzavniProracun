import React from 'react';
import ShowStateBudget from '../components/ShowStateBudget';
import { stateOutcomeToMoney } from '../dataFetcher/FetchStates';

class StateBudget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
        };

        console.log("Props budget: " , this.props);
        console.log("City: ", this.props.location.state.city);
    }

    async componentDidMount() {
        // call API
        let data = await stateOutcomeToMoney(this.props.location.state.city);

        console.log("Data: ", data);
        this.setState({
            stateData: data
        });
        this.render();
    }



    render() {
        //console.log("capitalCityCoordinates: ", this.state.capitalCityCoordinates);
        return (
            <ShowStateBudget data={this.state.stateData} />
        );
    }
}

export default StateBudget;