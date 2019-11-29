import React from 'react';
import {
    Link
} from "react-router-dom";

class MarkerPopup extends React.Component {

    render() {   
        return (
            <div id="markerPopup">
                <p>Občina: {this.props.city} </p>
                <div>
                    <Link to={{
                        pathname: "/stateBudget",
                        state: {city: this.props.city}
                    }}>Prikaži več</Link> 
                </div>
                
            </div>
        );
    }
}

export default MarkerPopup;