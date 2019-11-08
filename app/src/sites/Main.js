import React from 'react';
import Maps from '../components/Maps';
import { states } from '../dataFetcher/FetchStates';
import States from '../components/States';
import BarChart from '../components/charts/BarChart';


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
                console.log(element);
                capitalCity.push(element.lat, element.lon);
            }
        });

        console.log(capitalCity);
        // save to state
        this.setState({
            stateData: stateData,
            capitalCityCoordinates: capitalCity
        });


    }

    render() {
        console.log("capitalCityCoordinates: ", this.state.capitalCityCoordinates);
        return (
            <div id="Main">
                {
                    this.state.capitalCityCoordinates.length !== 0 ?
                    <Maps position={this.state.capitalCityCoordinates} zoom={150} data={this.state.stateData} /> :
                    <p>Loading data....Please wait</p>
                }
                <States name={"miha"} />
                <BarChart />
            </div>
        );
        
    }
}

export default Main;