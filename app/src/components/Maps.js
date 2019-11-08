import React from 'react';
//import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { customOptions, customPopup, customPopupDialog } from '../utils/LeafletUtils';
import { stateOutcomeMoney } from '../dataFetcher/FetchStates';

class Maps extends React.Component {

    componentDidMount() {
        // populate data to leaflet
        this.map = L.map("map", {
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
        this.updateMarkers(this.props.data);
    }

    componentDidUpdate({data}) {
        if(this.props.data !== data) {
            this.updateMarkers(this.props.data);
        }
    }

    async onMarkerClick(e) {
        let stateName = e.target.options.title;
        // API CALL
        let statesOutcome = await stateOutcomeMoney(stateName);
        let firstObjMoney = statesOutcome[0].value;
        let popup = e.target.getPopup();

        // set popup content to CUSTOM content with specific data
        popup.setContent(customPopupDialog(stateName, firstObjMoney));
        let content = popup.getContent();
        // print content of a popup to console
        console.log("Content: " + content);
    }

    updateMarkers(markersData) {
        this.layer.clearLayers();
        const markerImage = {
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            iconSize:     [25, 25], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            //popupAnchor:  [-3, -76]// point from which the popup should open relative to the iconAnchor
        };

        markersData.forEach(marker => {
            let leafletMarker = L.marker([marker.lat, marker.lon], {title: marker.name, icon: L.icon(markerImage)});

            // TODO: there should be data of companies etc...
            leafletMarker.bindPopup(customPopupDialog(marker.name, 15), customOptions);
            leafletMarker.on('click', this.onMarkerClick);
            // add marker to layer
            leafletMarker.addTo(this.layer);
        });
    }

    render() {
        return (
            <div id="map" />
        );
    }
}

export default Maps;