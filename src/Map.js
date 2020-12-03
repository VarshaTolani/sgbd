import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Vector from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Geolocation from 'ol/Geolocation';
import { fromLonLat } from 'ol/proj.js';
import {toLonLat} from 'ol/proj';
import {rotate} from 'ol/coordinate';
import React, {Component, useEffect, useRef, useState} from 'react';
import {Circle, Fill, Stroke, Style} from 'ol/style';
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

    this.view = new View({
      center: fromLonLat([2.896372, 41.60240]),
      zoom: 6.5
    })

    this.map =  new Map({
      target: 'mapContainer',
      layers: [ new TileLayer({
          source: new OSM() }) ],
      view: this.view,
    });

    var geolocation = new Geolocation({
      trackingOptions:{
        enableHighAccuracy: true,
      },
      projection: this.view.getProjection(),
    });

    function el(id){ return document.getElementById(id);}

    el('track').addEventListener('change', function () {
      geolocation.setTracking(this.checked);
    });

    geolocation.on('change', function () {
      el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
      el('altitude').innerText = geolocation.getAltitude() + ' [m]';
      el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
      el('heading').innerText = geolocation.getHeading() + ' [rad]';
      el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
      var coords = toLonLat(geolocation.getPosition(),geolocation.getProjection());
      el('coords').innerText = coords;
    });

    geolocation.on('error', function (error) {
      var info = document.getElementById('info');
      info.innerHTML = error.message;
      info.style.display = '';
    });

    var accuracyFeature = new Feature();
    geolocation.on('change:accuracyGeometry', function() {
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    var positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: 'green',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      })
    );

    var self = this;
    geolocation.on('change:position', function() {
      var coordinates = geolocation.getPosition();
      positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
      self.map.setView(new View({
          center: coordinates,
          zoom: 15,
        })
      );
    });

    this.geoLoc_vectorLayer = new VectorLayer({
      map: this.map,
      source: new VectorSource({
        features: [accuracyFeature, positionFeature],
      })
    });

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
