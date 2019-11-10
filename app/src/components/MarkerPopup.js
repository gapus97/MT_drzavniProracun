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
                    <img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='100px'/>
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