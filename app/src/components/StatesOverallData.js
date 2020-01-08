import React from 'react';
import { budgetCategories, categoriesMap } from '../utils/Queries';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import BarChartOverallData from './charts/BarChartOverallData';
import { darkTheme } from '../utils/StyleUtils';

class StatesOverallData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            graphData: [],
            selectedBudgetCategorie: budgetCategories.states_outcome
        };
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.data !== this.props.data) {
            this.updateData(this.props.data);
        }
    }

    updateData(updatedData) {
        this.setState({
            data: updatedData,
            graphData: this.parseGraphCategories(updatedData, categoriesMap.statesOutcome)
        });
    }

    parseGraphCategories = (data, categorieKey) => {
        let graphData = [];
        Object.keys(data).forEach(key => {
            let object = {
                "name": data[key][categorieKey].name,
                "value": data[key][categorieKey].value,
                "year": key
            };
            graphData.push(object);
        });
        graphData.sort((a, b) => (a.value > b.value) ? -1 : 1);
        return graphData;
    }

    onDropdownItemSelect = (categorieKey) => {
        let graphData = [];
        if (Object.keys(this.state.data).length > 0) {
            graphData = this.parseGraphCategories(this.state.data, categorieKey);
            this.setState({
                selectedBudgetCategorie: budgetCategories[categorieKey],
                graphData: graphData
            });
        }
    }

    render() {   
        let {
            graphData, 
            selectedBudgetCategorie
        } = this.state;

        let dropdownItems = [];
        for(const [key, value] of Object.entries(budgetCategories)) {
            dropdownItems.push(<Dropdown.Item key={key} eventKey={key} onClick={() => this.onDropdownItemSelect(`${key}`)} >{value}</Dropdown.Item>)
        };


        return (
            <div id="showOverallData">
                <Container style={{border: '1px solid #313131', borderRadius: 8, backgroundColor: darkTheme.sectionArea}}>
                    <Row style={{marginTop: 20}}>
                        <Col md={12}>
                            <Dropdown id="dropdown-basic-button">
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {`${selectedBudgetCategorie}`}
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
                                Object.keys(graphData).length > 0 ?
                                <BarChartOverallData data={graphData} categorie={selectedBudgetCategorie}/> : ''
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        );
        
    }
}

export default StatesOverallData;