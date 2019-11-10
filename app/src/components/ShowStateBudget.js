import React from 'react';


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
               <p>this is graph</p>
            </div>
        );
        
    }
}

export default ShowStateBudget;