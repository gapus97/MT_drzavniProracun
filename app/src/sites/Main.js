import React from 'react';
import Maps from '../components/Maps';
import { states } from '../dataFetcher/FetchStates';
import LoadingPage from '../components/LoadingPage';


class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            capitalCityCoordinates: []
        };
    }

    async componentDidMount() {
        this.getStates();
    }

    async getStates() {

        let stateData = await states();
        let capitalCity = [];

        stateData.forEach(element => {
            if(element.name === "Ljubljana") {
                capitalCity.push(element.lat, element.lon);
            }
        });

        // save to state
        this.setState({
            stateData: stateData,
            capitalCityCoordinates: capitalCity
        });


    }

    render() {
        return (
            <div id="Main">
                {
                    this.state.capitalCityCoordinates.length !== 0 ?
                    <Maps position={this.state.capitalCityCoordinates} zoom={150} data={this.state.stateData} /> :
                    <LoadingPage />
                }
            </div>
        );
        
    }
}

export default Main;