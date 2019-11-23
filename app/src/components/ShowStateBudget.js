import React from 'react';
/*import ZoomedTreeMap from './charts/ZoomedTreeMap';
import DendoGram from './charts/DendoGram';*/
import CirclePack from './charts/CirclePack';

class ShowStateBudget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedBudgetCategorie: this.props.budgetCategorie
        };
    }
    
    componentDidUpdate({data, budgetCategorie}) {
        if(this.props.data !== data) {
            this.updateData(this.props.data);
        }
        if(this.props.budgetCategorie !== budgetCategorie) {
            this.updateBudgetCategorie(budgetCategorie);
        }
    }

    updateData(updatedData) {
        console.log("Data is also updated");
        this.setState({
            data: updatedData
        });
    }

    updateBudgetCategorie(budgetCategorie) {
        this.setState({
            selectedBudgetCategorie: budgetCategorie
        });
    }




    render() {   
        console.log("State budget data: ", this.state.data);
        return (
            <div id="showStateBudget">
               { <CirclePack data={this.state.data} /> }
               { /* <ZoomedTreeMap data={this.state.data} /> */ }
            </div>
        );
        
    }
}

export default ShowStateBudget;