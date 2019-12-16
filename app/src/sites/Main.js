import React from 'react';
import Maps from '../components/Maps';
import { states, fetchData, fetchAPIData, getStates } from '../dataFetcher/FetchStates';
import LoadingPage from '../components/LoadingPage';
import { supportedFilters } from '../utils/Queries';
import OverallBudgetData from '../components/OverallBudgetData';
import MainSearch from '../components/MainSearch';



class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            capitalCityCoordinates: [],
            generalBudgetData: [],
            krneki: {}, 
            isStateSelected: false,
            zoom: 8
        };
    }

    async componentDidMount() {
        this.getStates();
    }

    async getStates() {

        let stateData = await getStates();
        let capitalCity = [];
        let generalBudgetData = [
            {
                2018: [],
                2017: [],
                2016: []
            }
        ];

        // Should be something else, but not enough time for API development!
        /*for(const [key, value] of Object.entries(budgetCategories)) {
            for(const [yearKey, value] of Object.entries(supportedYears)) {
                
                let categorieData = await fetchData("SKUPAJ*", key, value);
                generalBudgetData[0][yearKey].push(categorieData);
            }
        }*/

       

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

    searchBarCallBack = async (data) => {
        console.log("Search data: ", data);

        if (!data.length > 0) {
                   
            // search for results
            this.setState({
                capitalCityCoordinates: [data.lat, data.lon],
                zoom: 12,
                isStateSelected: true
            });     
        }
    }

    callWhenCheckbox = async (value) => {
        console.log("Parent data: ", value);

        if(value) {
            for(let key of Object.keys(value)) {
                console.log(key);
                if(key) {
                    // api call glede na parametre, a je to young family itd...
                    let stateData = await fetchAPIData("Kranj", key);
                    console.log(stateData);
                }
            }
        }
    }

    render() {
        return (
            <div>
                <MainSearch searchData={this.searchBarCallBack} stateData={this.state.stateData} zoom={this.state.zoom} checkboxValue={this.callWhenCheckbox} />
                <div id="Main">
                    {
                        this.state.capitalCityCoordinates.length !== 0 ?
                        <Maps position={this.state.capitalCityCoordinates} zoom={this.state.zoom} data={this.state.stateData} stateSelected={this.state.isStateSelected} /> :
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