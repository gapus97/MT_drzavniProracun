import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class Maps extends React.Component {

    parseMarkers() {
        // get array of points
        let data = this.props.data;
        let markerData = [];

        data.forEach(element => {
            let position = [element.lat, element.lon];
            markerData.push(<Marker position={position} key={element.id} />);
        });
        
        return markerData;    
    }

    render() {
        return (
            <Map center={this.props.position} zoom={this.props.zoom} >
                <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {
                    this.parseMarkers()
                }
            </Map>
        );
    }
}

export default Maps;