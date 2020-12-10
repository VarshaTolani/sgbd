import 'ol/ol.css';
import {Map, View} from 'ol';
import Overlay from 'ol/Overlay';
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
import axios from 'axios'



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
      var projCoordinates = toLonLat(geolocation.getPosition(),geolocation.getProjection()).reverse();
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

    if (this.props.restaurants){

      if (this.vectorLayer){
        this.map.removeLayer(this.vectorLayer)
      }

      this.geo_points = this.props.restaurants.map(r =>
        new Feature({
          geometry: new Point(fromLonLat(r._source.localitzacio.split`,`.map(Number).reverse())),
          restaurant_id: r._id,
          restaurant_name: r._source.nom,
          restaurant_type: r._source.categoria

        })
      )

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
        updateWhileAnimating: true,
        updateWhileInteracting: true,
      });

      this.map.addLayer(this.vectorLayer);

      //** Pop-Ups **//
      var container = document.getElementById("ol-popup");
      var contentName = document.getElementById("contentName");
      var contentInfo = document.getElementById("contentInfo");
      if(container == null) console.log("ERROR: Popup container null");
      var popup = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation:{
          duration: 250,
        },
      });

      this.map.addOverlay(popup);

      var selfPop = this;
      var feature;
      this.map.on('singleclick', function(evt){
        popup.setPosition(undefined);

        feature = selfPop.map.forEachFeatureAtPixel(evt.pixel,function(feature,layer){
          return feature;
        });

        if(feature){
          var coord = feature.getGeometry().getCoordinates();
          var popProps = this.props;
          var name = feature.values_.restaurant_name;
          var info = feature.values_.restaurant_type;
          contentName.innerHTML = name;
          contentInfo.innerHTML = '&nbsp' + info;
          popup.setPosition(coord);
          selfPop.props.setCurrentRestaurant(name);
        }
      });

      this.map.on('pointermove', function(evt){
        var hit = selfPop.map.forEachFeatureAtPixel(evt.pixel, function(feature,layer){
          return true;
        });

        if(hit){
          this.getTargetElement().style.cursor = 'pointer';
        }
        else{
          this.getTargetElement().style.cursor = '';
        }
      });

      //Menu info
      var menuSelf = this;
      document.getElementById("contentName").addEventListener("click",function(){
        //AQUI CRIDAR FUNCIÓ DE LA QUERY
        document.getElementById("menuSidepanel").style.width = "340px";
        document.getElementById("menuSidepanel").style.paddingLeft = "20px";
        document.getElementById("ol-map").style.marginRight = "370px";
        document.getElementById("panel-nomRest").innerHTML = feature.values_.restaurant_name;
        document.getElementById("panel-categRest").innerHTML = feature.values_.restaurant_type;
        document.getElementById("panel-valRest").innerHTML = menuSelf.props.selectedRestaurant._source.valoracio;

      });

      document.getElementById("closeBtn").addEventListener("click",function(){
        document.getElementById("menuSidepanel").style.width = "0";
        document.getElementById("menuSidepanel").style.paddingLeft = "0";
        document.getElementById("ol-map").style.marginRight= "0";
      });

    } // if props
  } //componentUpdate


  render(){
    return(
      <div id="mapContainer" ref={this.mapRef} style={{width: '80vw', height: '80vh'}}> </div>
    );
  }

}
