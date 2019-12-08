import React from 'react';
import Maps from '../components/Maps';
import { states, fetchData, fetchAPIData } from '../dataFetcher/FetchStates';
import LoadingPage from '../components/LoadingPage';
import { budgetCategories, supportedYears } from '../utils/Queries';
import OverallBudgetData from '../components/OverallBudgetData';
import MainSearch from '../components/MainSearch';



class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            capitalCityCoordinates: [],
            generalBudgetData: [],
            krneki: {}
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

        /* Only testing */

        let neki = await fetchAPIData("SKUPAJ*", null, null);
        console.log("Testing new API: ", neki);


    }

    searchBarCallBack = (data) => {
        console.log("Search data: ", data);

        // search for results

        if (this.state.stateData) {
            this.state.stateData.forEach(state => {
                if(state.name.includes(data)) {
                    console.log(state);
                }
            });
        }
    }

    render() {
        return (
            <div>
                <MainSearch searchData={this.searchBarCallBack} stateData={this.state.stateData} />
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
            </div>
        );
        
    }
}

export default Main;