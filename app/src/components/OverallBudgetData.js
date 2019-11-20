import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class OverallBudgetData extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sumValues: []
        };
    }

    componentDidMount() {
        this.parseData();
    }

    parseData() {
        let overallBudgetData = this.props.data;
        let parsedElements = [];
        let sumValues = [];

        

        console.log("Overall: ", overallBudgetData[0][2018]);

        const overallBudgetDataKeys = Object.keys(overallBudgetData[0])
        for (const key of overallBudgetDataKeys) {
            console.log("Key: ", key);
            let sum = this.elementSum(overallBudgetData[0][key]);
            var yearSum = {
                "year": key,
                "value": sum
            };
            sumValues.push(yearSum);
        }

        console.log("Sum: ", sumValues);

        this.setState({
            sumValues: sumValues
        });

    }

    elementSum(arrayValues) {
        console.log("Array value: ", arrayValues);
        let sum = 0;
        for(let i = 0; i < arrayValues.length; i++) {
            let elementSum = arrayValues[i].value;
            sum += elementSum;
        }

        console.log("Sum: ", sum);
        return sum;
    }

    showOverallBudgetData() {
        let isAscending = false;
        let value = 0;

        this.state.sumValues.map((key) => {
            console.log("Key: ", key);
            if(key.value > value) {
                value = key.value;
                isAscending = true;
            }
        })
        return (
            <Container className="overallBudget justify-content-md-center">
                <Row className="justify-content-md-center">
                    {
                        this.state.sumValues.map((key) =>
                            <Col className="overallBudget-item" key={key.year} md={3}>
                                <h3 className="overallBudget-item-year">{key.year}</h3>
                                <p className="overallBudget-item-value">{(key.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} €</p>
                            </Col>
                        )
                    }
                    <Col className="overallBudget-item" md={3}>
                    {
                        isAscending ? 
                        <div className="overallBudget-item overallBudget-ascending">
                            <h3>Proračun: </h3>
                            <FontAwesomeIcon icon={faArrowUp} />
                        </div> : 
                        <div className="overallBudget-descending"> 
                            <h3>Proračun:</h3>
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    }
                    </Col>
                </Row>
            </Container>
        );
    }

    render() {
        return (
            <div>
            
                <p>Skupni proračun vseh občin za 2016/17 in 18</p>
                {
                    this.showOverallBudgetData()
                }
                
            </div>
        );
    }
}

export default OverallBudgetData;