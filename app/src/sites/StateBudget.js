import React from 'react';
import ShowStateBudget from '../components/ShowStateBudget';
import Dropdown from 'react-bootstrap/Dropdown';
import { budgetCategories } from '../utils/Queries';
import  { isDataValid, parseAllCategories } from '../utils/ParsingUtils';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { darkTheme } from '../utils/StyleUtils';


class StateBudget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            allData: [],
            stateData: [],
            selectedBudgetCategorie: budgetCategories.states_outcome,
            generalBudgetData: [],
            isDataAvailable: false
        };
        this.onDropdownItemSelect = this.onDropdownItemSelect.bind(this);
    }

    async componentDidMount() {

        if(this.props.showState) {
            let generalBudgetData = await parseAllCategories(this.props.city);

            this.checkData(generalBudgetData);

            this.setState({
                stateData: generalBudgetData,
                allData: generalBudgetData
            });
        }
        
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevProps.showState !== this.props.showState) {

            if (this.props.showState) {
                let generalBudgetData = await parseAllCategories(this.props.city);

                this.checkData(generalBudgetData);

                this.setState({
                    stateData: generalBudgetData,
                    allData: generalBudgetData
                });
            }
        }
    }

    checkData(data) {
        isDataValid(data) ? this.setState({isDataAvailable: true}) : this.setState({isDataAvailable: false});
    }
    onDropdownItemSelect = async (dataKey) => {

        // DEEP CLONING! BE CAREFULL!
        let generalBudgetData = JSON.parse(JSON.stringify(this.state.allData));


        for(let key of Object.keys(generalBudgetData[0])) {
            let yearData = generalBudgetData[0][key].filter(item => item.categorie === dataKey);
            generalBudgetData[0][key] = yearData;
        }
       

        if (generalBudgetData) {
            this.checkData(generalBudgetData);
        }

        this.setState({
            selectedBudgetCategorie: budgetCategories[dataKey],
            stateData: generalBudgetData
        });
    }


    onHide = () => {
        this.props.onHideState(true);
    }

    render() {
        let dropdownItems = [];
        for(const [key, value] of Object.entries(budgetCategories)) {
            dropdownItems.push(<Dropdown.Item key={key} eventKey={key} onClick={() => this.onDropdownItemSelect(`${key}`)} >{value}</Dropdown.Item>)
        }

        return (
            <Modal
                show={this.props.showState}
                onHide={this.onHide}
                size="lg"
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="stateBudgetModalTitle">
                        Proračun občine
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: darkTheme.body}}>
                    <Container>
                        <Row>
                            <Col>
                                <p>{this.props.city}</p>
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
                                    <ShowStateBudget data={this.state.stateData} budgetCategorie={this.state.selectedBudgetCategorie} city={this.props.city}/>
                                    : <p>Prosim izberite druge podatke</p>
                                }
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>

        );
    }
}

export default StateBudget;