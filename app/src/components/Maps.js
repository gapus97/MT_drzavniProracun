import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerPopup from './MarkerPopup';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class Maps extends React.Component {

    componentDidMount() {
        // populate data to leaflet
        /*this.map = L.map("map", {
            center: this.props.position,
            zoom: 8,
            layers: [
                L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });

        this.layer = L.layerGroup().addTo(this.map);
        this.updateMarkers(this.props.data);*/
    
    }

    componentDidUpdate({data}) {
        if(this.props.data !== data) {
            this.updateMarkers(this.props.data);
        }
    }

    async onMarkerClick(e) {
        /*let stateName = e.target.options.title;
        // API CALL
        let statesOutcome = await stateOutcomeMoney(stateName);
        console.log(statesOutcome);
        let stateMoney = statesOutcome.sumValue;
        let popup = e.target.getPopup();

        console.log("E: ", e.target);

        // set popup content to CUSTOM content with specific data
        //popup.setContent(customPopupDialog(stateName, stateMoney));
        //popup.bindPopup(<MarkerPopup text={stateName} money={stateMoney} data={statesOutcome} />, customOptions);
        
        //popup.setContent(<MarkerPopup text={stateName} money={stateMoney} data={statesOutcome} />);
        let content = popup.getContent();
        // print content of a popup to console
        console.log("Content: " + content);*/
    }

    updateMarkers(markersData) {
        this.layer.clearLayers();
        const markerImage = {
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            iconSize:     [25, 25], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            //popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
        };

        /*markersData.forEach(marker => {
            let leafletMarker = L.marker([marker.lat, marker.lon], {title: marker.name, icon: L.icon(markerImage)});

            // TODO: there should be data of companies etc...
            leafletMarker.bindPopup(customPopupDialog(marker.name, 15), customOptions);
            leafletMarker.on('click', this.onMarkerClick);
            // add marker to layer
            leafletMarker.addTo(this.layer);
        });*/
    }

    render() {
        let markers = this.props.data.map((element) => 
            <Marker 
                key={element.id} 
                position={[element.lat, element.lon]} 
                title={element.name} 
                style={{ height: "25px", width: "25px" }}
                onClick={this.onMarkerClick}>
                <Popup>
                    <MarkerPopup city={element.name} />
                </Popup>
                
            </Marker>
        );
        /* <div id="markerPopup">
                    <p>{this.props.text} </p>
                    <img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='100px'/>
                    <p>Proračun: {this.props.money} </p>
                    
                </div> */
        /*<Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>*/
        return (
            <div id="map">
                <Map center={this.props.position} zoom={8} style={{ height: "500px" }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    {markers}
                </Map>
            </div>
        );

        /*
        <Marker position={this.props.position} url={'leaflet/dist/images/marker-icon.png'}>
                        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
                    </Marker> */
    }
}

export default Maps;