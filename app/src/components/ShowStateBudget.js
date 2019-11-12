import React from 'react';
import ZoomedTreeMap from './charts/ZoomedTreeMap';

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
                <p>Izbrana kategorija: </p>
               <ZoomedTreeMap data={this.props.data} />
            </div>
        );
        
    }
}

export default ShowStateBudget;