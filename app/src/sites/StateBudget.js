import React from 'react';
import ShowStateBudget from '../components/ShowStateBudget';
import Dropdown from 'react-bootstrap/Dropdown';
import { budgetCategories } from '../utils/Queries';
import  { parseBudgetCategories, parseBudgetCategorie, isDataValid } from '../utils/ParsingUtils';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class StateBudget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateData: [],
            selectedBudgetCategorie: budgetCategories.statesOutcome,
            generalBudgetData: [],
            isDataAvailable: false
        };
        this.onDropdownItemSelect = this.onDropdownItemSelect.bind(this);
    }

    async componentDidMount() {
        let generalBudgetData = await parseBudgetCategories(this.props.location.state.city);

        this.checkData(generalBudgetData);
    
        this.setState({
            stateData: generalBudgetData
        });
    }

    checkData(data) {
        isDataValid(data) ? this.setState({isDataAvailable: true}) : this.setState({isDataAvailable: false});
    }
    onDropdownItemSelect = async (dataKey) => {

        let generalBudgetData = await parseBudgetCategorie(this.props.location.state.city, dataKey);

        if (generalBudgetData) {
            this.checkData(generalBudgetData);
        }

        this.setState({
            selectedBudgetCategorie: budgetCategories[dataKey],
            stateData: generalBudgetData
        });
    }

    render() {
        let dropdownItems = [];
        for(const [key, value] of Object.entries(budgetCategories)) {
            dropdownItems.push(<Dropdown.Item key={key} eventKey={key} onClick={() => this.onDropdownItemSelect(`${key}`)} >{value}</Dropdown.Item>)
        }

        return (
            <Container>
                <Row>
                    <Col>
                        <p>{this.props.location.state.city}</p>
                    </Col>
                    <Col>
                        <Dropdown id="dropdown-basic-button">
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {`${this.state.selectedBudgetCategorie}`}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                { dropdownItems }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        {
                            this.state.isDataAvailable ?
                            <ShowStateBudget data={this.state.stateData} budgetCategorie={this.state.selectedBudgetCategorie} city={this.props.location.state.city}/>
                            : <p>Prosim izberite druge podatke</p>
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default StateBudget;