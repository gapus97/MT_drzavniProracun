import React from 'react';
import Maps from '../components/Maps';
import { states, fetchData } from '../dataFetcher/FetchStates';
import LoadingPage from '../components/LoadingPage';
import { budgetCategories, supportedYears } from '../utils/Queries';
import OverallBudgetData from '../components/OverallBudgetData';



class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            capitalCityCoordinates: [],
            generalBudgetData: []
        };
    }

    async componentDidMount() {
        this.getStates();
    }

    async getStates() {

        let stateData = await states();
        let capitalCity = [];
        let generalBudgetData = [
            {
                2018: [],
                2017: [],
                2016: []
            }
        ];

        // Should be something else, but not enough time for API development!
        for(const [key, value] of Object.entries(budgetCategories)) {
            for(const [yearKey, value] of Object.entries(supportedYears)) {
                
                let categorieData = await fetchData("SKUPAJ*", key, value);
                generalBudgetData[0][yearKey].push(categorieData);
            }
        }

       

        stateData.forEach(element => {
            if(element.name === "Ljubljana") {
                capitalCity.push(element.lat, element.lon);
            }
        });

        console.log("All data: ", generalBudgetData);

        // save to state
        this.setState({
            stateData: stateData,
            capitalCityCoordinates: capitalCity,
            generalBudgetData: generalBudgetData
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
                {
                    this.state.generalBudgetData.length !== 0 ?
                    <OverallBudgetData data={this.state.generalBudgetData} /> :
                    <LoadingPage />
                }
            </div>
        );
        
    }
}

export default Main;