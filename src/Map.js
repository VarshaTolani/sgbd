import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Vector from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj.js';
import React, {Component, useEffect, useRef, useState} from 'react';
import {Circle, Fill, Style} from 'ol/style';
import Icon from 'ol/style/Icon';
import {transform} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer} from 'ol/layer';


export default class Mapa extends React.Component {

  constructor(props){
    super(props)
    this.mapRef = React.createRef()
  }

  componentDidMount() { 

    this.map =  new Map({
      target: 'mapContainer',
      layers: [ new TileLayer({
          source: new OSM() }) ],
      view: new View({
        center: fromLonLat([2.896372, 44.60240]),
        zoom: 3
      })
    })

    this.vectorLayer = null

  }

  componentDidUpdate() {
    
    if (this.props.positions){

      if (this.vectorLayer){
        this.map.removeLayer(this.vectorLayer)
      }

      this.geo_points = this.props.positions.map(p =>
        new Feature({
          geometry: new Point(fromLonLat(p.split`,`.map(Number).reverse()))
        }) )

      this.vectorSource = new VectorSource({
        features: this.geo_points
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

      this.map.addLayer(this.vectorLayer)
    }
  }

  render(){    
    return(      
      <div id="mapContainer" ref={this.mapRef} style={{width: '80vw', height: '80vh'}}> </div>        
    );
  }

}
