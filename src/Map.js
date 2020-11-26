
import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import React, {Component} from 'react';

export default class Mapa extends React.Component{

  componentDidMount() {
    
    this.chicago = new Feature({
      geometry: new Point(fromLonLat([-87.623177, 41.881832]))
    });

    this.london = new Feature({
      geometry: new Point(fromLonLat([-0.12755, 51.507222]))
    });

    this.madrid = new Feature({
      geometry: new Point(fromLonLat([-3.683333, 40.4]))
    });

    this.vectorSource = new VectorSource({
      features: [this.chicago, this.madrid, this.london]
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.map = new Map({
      target: 'mapContainer',
      layers: [ new TileLayer({
        source: new OSM()
      }), this.vectorLayer ],
      view: new View({
        center: fromLonLat([2.896372, 44.60240]),
        zoom: 3
      })
    });

  render(){
    console.log('-> render App')
    return(
      <div id="mapContainer" ref="mapContainer" style={{width: '80vw', height: '80vh'}}> </div>
    );
  }

}


/*import { GoogleMap,
        withScriptjs,
        withGoogleMap,
        Marker
     } from "react-google-maps"

const Politecnica_UDG_position = { lat: 41.964162, lng: 2.830088 };

function CreateMap() {
    return (
        <GoogleMap
          defaultZoom={10}
          defaultCenter={{lat: 41.981651, lng: 2.823610}}
        >
            <Marker position={Politecnica_UDG_position}/>
        </GoogleMap>
    );
}

const WrappedMap = withScriptjs(withGoogleMap(CreateMap));

export default function Map(){
    return(
      <div style={{width: '70vw', height: '70vh'}}>
        <WrappedMap
            googleMapURL= {"https://maps.googleapis.com/maps/api/js?key=AIzaSyDzw2uiT3nAzHYONGS9fEzOi7tOjhQ0VsY&v=3.exp&libraries=geometry,drawing,places"}
            loadingElement={ <div style={{ height: "100%" }} /> }
            containerElement={ <div style={{ height: "100%" }} /> }
            mapElement={ <div style={{ height: "100%" }} /> }
        />
      </div>
    )
}*/
