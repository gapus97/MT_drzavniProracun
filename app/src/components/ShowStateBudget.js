import React from 'react';
/*import ZoomedTreeMap from './charts/ZoomedTreeMap';
import DendoGram from './charts/DendoGram';*/
import CirclePack from './charts/CirclePack';

class ShowStateBudget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentDidUpdate({data}) {
        if(this.props.data !== data) {
            this.updateData(this.props.data);
        }
    }

    updateData(updatedData) {
        this.setState({
            data: updatedData
        })
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