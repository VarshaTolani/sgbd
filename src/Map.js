
import 'ol/ol.css';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Point from 'ol/geom/Point';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import React, {Component} from 'react';

export default class Mapa extends React.Component{

  constructor(props) {
        super(props);

        this.view = new View({
            center: fromLonLat([2.82975, 41.96425]),
            zoom: 16
        });
    }

  componentDidMount() {
      this.map =  new Map({
          view: this.view,
          layers: [new TileLayer({ source: new OSM() })],
          target: this.refs.mapContainer
      });

      this.geolocation = new Geolocation({
          trackingOptions:{
            enableHighAccuracy: true,
          },
          projection: this.view.getProjection(),
      });

      function el(id) {
          return document.getElementById(id);
      }

      el('track').addEventListener('change', function () {
          this.geolocation.setTracking(this.checked);
      });

      // update the HTML page when the position changes.
      this.geolocation.on('change', function () {
          el('accuracy').innerText = this.geolocation.getAccuracy() + ' [m]';
          el('altitude').innerText = this.geolocation.getAltitude() + ' [m]';
          el('altitudeAccuracy').innerText = this.geolocation.getAltitudeAccuracy() + ' [m]';
          el('heading').innerText = this.geolocation.getHeading() + ' [rad]';
          el('speed').innerText = this.geolocation.getSpeed() + ' [m/s]';
      });

      // handle geolocation error.
      this.geolocation.on('error', function (error) {
          var info = document.getElementById('info');
          info.innerHTML = error.message;
          info.style.display = '';
      });

      var accuracyFeature = new Feature();
          this.geolocation.on('change:accuracyGeometry', function () {
          accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
      });

      var positionFeature = new Feature();
      positionFeature.setStyle(
          new Style({
              image: new CircleStyle({
                  radius: 6,
                  fill: new Fill({
                      color: '#3399CC',
                  }),
                  stroke: new Stroke({
                      color: '#fff',
                      width: 2,
                  }),
                }),
          })
      );

      this.geolocation.on('change:position', function () {
          var coordinates = this.geolocation.getPosition();
          positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
      });

      new VectorLayer({
          map: this.map,
            source: new VectorSource({
              features: [accuracyFeature, positionFeature],
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
