import React from 'react';
//import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const style = {
    map: {
      height: '500px',
      width: '100%'
    }
}

class Maps extends React.Component {

    componentDidMount() {
        // populate data to leaflet
        this.map = L.map("map", {
            center: this.props.position,
            zoom: 9,
            layers: [
                L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });

        this.layer = L.layerGroup().addTo(this.map);
        this.updateMarkers(this.props.data);
    }

    componentDidUpdate({data}) {
        if(this.props.data !== data) {
            this.updateMarkers(this.props.data);
        }
    }

    onMarkerClick(e) {
        let popup = e.target.getPopup();
        let content = popup.getContent();
        console.log(content);
    }

    updateMarkers(markersData) {
        this.layer.clearLayers();
        const markerImage = {
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            iconSize:     [30, 30], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            //popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
        };
        markersData.forEach(marker => {
            let leafletMarker = L.marker([marker.lat, marker.lon], {title: marker.name, icon: L.icon(markerImage)});

            // TODO: there should be data of companies etc...
            leafletMarker.bindPopup("This is popup for: " + marker.name);
            leafletMarker.on('click', this.onMarkerClick);
            // add marker to layer
            leafletMarker.addTo(this.layer);
        });
    }

    render() {
        return (
            <div id="map" style={style.map} />
        );
    }
}

export default Maps;