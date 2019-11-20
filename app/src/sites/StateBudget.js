import React from 'react';
import ShowStateBudget from '../components/ShowStateBudget';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { stateOutcomeToMoney, fetchData } from '../dataFetcher/FetchStates';
import { budgetCategories, supportedYears, queryMap } from '../utils/Queries';

class StateBudget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            selectedBudgetCategorie: budgetCategories.statesOutcome,
            generalBudgetData: []
        };
        this.onDropdownItemSelect = this.onDropdownItemSelect.bind(this);
    }

    async componentDidMount() {
        let generalBudgetData = [
            {
                2018: [],
                2017: [],
                2016: []
            }
        ];

        // call API
        for(const [key, value] of Object.entries(budgetCategories)) {
            for(const [yearKey, value] of Object.entries(supportedYears)) {
                
                let categorieData = await fetchData(this.props.location.state.city, key, value);
                generalBudgetData[0][yearKey].push(categorieData);
            }
        }

        
        console.log("All data: ", generalBudgetData);
        this.setState({
            stateData: generalBudgetData
        });
    }

    onDropdownItemSelect = async (dataKey) => {
        console.log("Dropdown select: " ,dataKey);

        let data = await fetchData(this.props.location.state.city, dataKey, 2018);

        console.log("Response: ", data);

        this.setState({
            selectedBudgetCategorie: budgetCategories[dataKey],
            stateData: data
        });
    }

    render() {
        //console.log("capitalCityCoordinates: ", this.state.capitalCityCoordinates);
        let dropdownItems = [];
        for(const [key, value] of Object.entries(budgetCategories)) {
            dropdownItems.push(<Dropdown.Item key={key} eventKey={key} onClick={() => this.onDropdownItemSelect(`${key}`)} >{value}</Dropdown.Item>)
        }

        //console.log("Items: ", dropdownItems);
        return (
            <div>
               <Dropdown id="dropdown-basic-button">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {`${this.state.selectedBudgetCategorie}`}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        { dropdownItems }
                    </Dropdown.Menu>
                </Dropdown>
                <ShowStateBudget data={this.state.stateData} />
            </div>
        );
    }
}

export default StateBudget;