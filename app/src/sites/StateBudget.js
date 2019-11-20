import React from 'react';
import ShowStateBudget from '../components/ShowStateBudget';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { stateOutcomeToMoney, fetchData } from '../dataFetcher/FetchStates';
import { budgetCategories } from '../utils/Queries';

class StateBudget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            selectedBudgetCategorie: budgetCategories.statesOutcome
        };

        this.onDropdownItemSelect = this.onDropdownItemSelect.bind(this);
    }

    async componentDidMount() {
        // call API
        let data = await stateOutcomeToMoney(this.props.location.state.city,2018);

        this.setState({
            stateData: data
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