import React from 'react';
import ShowStateBudget from '../components/ShowStateBudget';
import { stateOutcomeToMoney } from '../dataFetcher/FetchStates';

class StateBudget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
        };
    }

    async componentDidMount() {
        // call API
        let data = await stateOutcomeToMoney(this.props.location.state.city);

        this.setState({
            stateData: data
        });
    }



    render() {
        //console.log("capitalCityCoordinates: ", this.state.capitalCityCoordinates);
        return (
            <ShowStateBudget data={this.state.stateData} />
        );
    }
}

export default StateBudget;