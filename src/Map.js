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
import {toStringHDMS} from 'ol/coordinate';
import {Overlay} from 'ol/index';


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

    var geoCoords;

    geolocation.on('change', function () {
      el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
      el('altitude').innerText = geolocation.getAltitude() + ' [m]';
      el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
      el('heading').innerText = geolocation.getHeading() + ' [rad]';
      el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
      geoCoords = toLonLat(geolocation.getPosition(),geolocation.getProjection());
      el('coordsLat').innerText = geoCoords[1].toFixed(3);
      el('coordsLon').innerText = geoCoords[0].toFixed(3);
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
      var projCoordinates = toLonLat(geolocation.getPosition(),geolocation.getProjection());
      self.props.setCurrentCoordinates(projCoordinates);
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
	
	// /*** POPUP ***/
	// var x = this;
	// var element = document.getElementById('popup');

	// var popup = new Overlay({
	//   element: element,
	//   positioning: 'bottom-center',
	//   stopEvent: false,
	//   offset: [0, -10],
	// });
	// x.map.addOverlay(popup);

	// function formatCoordinate(coordinate) {
	//   return ("\n    <table>\n      <tbody>\n        <tr><th>lon</th><td>" + " ERROR1 " + "</td></tr>\n        <tr><th>lat</th><td>" + " ERROR2 " + "</td></tr>\n      </tbody>\n    </table>");
	// }

	// var info = document.getElementById('info');
	// x.map.on('moveend', function () {
	//   var view = x.map.getView();
	//   var center = view.getCenter();
	//   info.innerHTML = formatCoordinate(center);
	// });

	// x.map.on('click', function (event) {
	//   var feature = x.map.getFeaturesAtPixel(event.pixel)[0];
	//   if (feature) {
	// 	var coordinate = feature.getGeometry().getCoordinates();
	// 	popup.setPosition(coordinate);
	// 	$(element).popover({
	// 	  container: element,
	// 	  html: true,
	// 	  sanitize: false,
	// 	  content: formatCoordinate(coordinate),
	// 	  placement: 'top',
	// 	});
	// 	$(element).popover('show');
	//   } else {
	// 	$(element).popover('dispose');
	//   }
	// });

	// x.map.on('pointermove', function (event) {
	//   if (x.map.hasFeatureAtPixel(event.pixel)) {
	// 	x.map.getViewport().style.cursor = 'pointer';
	//   } else {
	// 	x.map.getViewport().style.cursor = 'inherit';
	//   }
	// });
  }


  render(){
    return(
      <div id="mapContainer" ref={this.mapRef} style={{width: '80vw', height: '80vh'}}> </div>
    );
  }

}