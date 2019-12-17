import React from 'react';
import Maps from '../components/Maps';
import { fetchAPIData, getStates } from '../dataFetcher/FetchStates';
import LoadingPage from '../components/LoadingPage';
import { supportedFilters } from '../utils/Queries';
import MainSearch from '../components/MainSearch';
import StateIndexDataShower from '../components/StateIndexDataShower';



class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            capitalCityCoordinates: [],
            generalBudgetData: [],
            isStateSelected: false,
            zoom: 8,
            searchedState: {},
            searchedData: []
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

        if(stateData) {
            stateData.forEach(element => {
                if(element.name === "Ljubljana") {
                    capitalCity.push(element.lat, element.lon);
                }
            });
        }

        // save to state
        this.setState({
            stateData: stateData,
            capitalCityCoordinates: capitalCity,
            generalBudgetData: generalBudgetData
        });

    }

    searchBarCallBack = async (data) => {
        console.log("Search data: ", data);

        if (!data.length > 0) {
                   
            // search for results
            this.setState({
                searchedState: data,
                capitalCityCoordinates: [data.lat, data.lon],
                zoom: 12,
                isStateSelected: true
            });     
        }
    }

    /*callWhenCheckbox = async (checkboxes) => {
        console.log("Parent data: ", checkboxes);

        if(checkboxes) {
            this.setState({
                checkboxes: checkboxes
            });
        }
    }*/


    executeSearch = async (checkboxes) => {
        console.log(checkboxes);

        const {
            isStateSelected,
            searchedState
        } = this.state;

        // if everting if good, then make api call
        if(isStateSelected && searchedState) {
            for(let key of Object.keys(checkboxes)) {
                console.log("Key: ", checkboxes[key]);

                /* execute only if value of the key is true  -> is selected */
                if(checkboxes[key]) {
                    if(this.state.searchedState) {
                        let stateData = await fetchAPIData(searchedState.name, key);
                        console.log(stateData);
                        this.setState({
                            searchedData: stateData
                        });
                    }
                }
            }
        }
    }

    render() {
        const {
            capitalCityCoordinates,
            zoom,
            stateData,
            isStateSelected,
            searchedState,
            searchedData
        } = this.state;




        return (
            <div>
                <MainSearch 
                    searchData={this.searchBarCallBack} 
                    stateData={stateData} 
                    zoom={zoom} 
                    checkboxValue={this.callWhenCheckbox} 
                    executeSearch={this.executeSearch} />
                <div id="Main">
                    {
                        capitalCityCoordinates.length !== 0 ?
                        <Maps 
                            position={capitalCityCoordinates} 
                            zoom={zoom} 
                            data={stateData} 
                            stateSelected={isStateSelected} /> : <LoadingPage />
                    }

                    {
                        isStateSelected && searchedState && searchedData?
                        <StateIndexDataShower data={searchedData} /> : ''
                    }
                </div>
            </div>
        );
        
    }
}

export default Main;