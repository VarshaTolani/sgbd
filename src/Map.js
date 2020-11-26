import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Vector from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj.js';
import React, {Component} from 'react';
import {Circle, Fill, Style} from 'ol/style';
import Icon from 'ol/style/Icon';
import {transform} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer} from 'ol/layer';

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
      source: this.vectorSource,
	  style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({color: 'red'}),
        }),
      }),
    });

    this.map = new Map({
      target: 'mapContainer',
      layers: [ new TileLayer({
       source: new OSM()
      }), this.vectorLayer ],
      view: new View({
        center: fromLonLat([2.896372, 44.60240]),
        zoom: 3
      }),
    });
  
  
  }

  render(){
    console.log('-> render App')
    return(
      <div id="mapContainer" ref="mapContainer" style={{width: '80vw', height: '80vh'}}> </div>
    );
  }

}
