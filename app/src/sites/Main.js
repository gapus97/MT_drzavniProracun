import React from 'react';
//import Maps from '../components/Maps';
import { fetchAPIData, getStates, getOverallStateData} from '../dataFetcher/FetchStates';
/*import LoadingPage from '../components/LoadingPage';
import { supportedFilters } from '../utils/Queries';*/
import MainSearch from '../components/MainSearch';
import StateIndexDataShower from '../components/StateIndexDataShower';
import StatesOverallData from '../components/StatesOverallData';
import AboutProjectText from '../components/AboutProjectText';


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
            searchedData: [],
            searchedStateIndexData: {},
            overallData: {}
        };
    }

    async componentDidMount() {
        this.getStates();
        this.getOverallData();
    }

    getStates = async() => {

        let stateData = await getStates();
        let capitalCity = [];
        let generalBudgetData = [
            {
                2018: [],
                2017: [],
                2016: []
            }
        ];

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

    getOverallData = async() => {
        let overallData = await getOverallStateData();

        if(Object.keys(overallData).length > 0) {
            this.setState({
                overallData: overallData
            });
        }
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

        const {
            isStateSelected,
            searchedState
        } = this.state;

        // if everting if good, then make api call
        if(isStateSelected && searchedState) {
            console.log("Key: ", checkboxes);

            /* execute only if value of the key is true  -> is selected */
            if(checkboxes) {
                if(this.state.searchedState) {
                    let statesIndexData = await fetchAPIData(searchedState.name, checkboxes);
                    let stateIndexData = {};

                    if(statesIndexData) {
                        statesIndexData.forEach((state, index) => {
                            if (state.name === searchedState.name) {
                                stateIndexData = state;
                                stateIndexData.place = index + 1;
                            } else {
                                state.place = index + 1;
                                //stateIndexData[index] = index + 1;
                            }
                        });
                        this.setState({
                            searchedData: statesIndexData,
                            searchedStateIndexData: stateIndexData,
                            isClicked: true
                        });
                    }
                   
                }
            }
            
        }
    }

    render() {
        const {
            zoom,
            stateData,
            isStateSelected,
            searchedState,
            searchedData,
            searchedStateIndexData,
            overallData
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
                        /*capitalCityCoordinates.length !== 0 ?
                        <Maps 
                            position={capitalCityCoordinates} 
                            zoom={zoom} 
                            data={stateData} 
                            stateSelected={isStateSelected} /> : <LoadingPage />*/
                        
                    }

                    {
                        isStateSelected && searchedState && searchedData && searchedStateIndexData ?
                        <StateIndexDataShower data={searchedData} searchedStateIndexData={searchedStateIndexData} /> : 
                        [<StatesOverallData data={overallData} key="overallData" />, <AboutProjectText key="projectIntroText" />]
                    }
                </div>
            </div>
        );
        
    }
}

export default Main;