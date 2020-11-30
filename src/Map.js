import 'ol/ol.css';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Vector from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj.js';
import React, {Component, useEffect, useRef} from 'react';
import {Circle, Fill, Style} from 'ol/style';
import Icon from 'ol/style/Icon';
import {transform} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer} from 'ol/layer';



function initialize_map(positions){
  console.log('Positions: ', positions)
  if (positions){
    let geo_points = positions.map(p =>
      new Feature({
        geometry: new Point(fromLonLat(p.split`,`.map(x => +x)))
      }) )

    let vectorSource = new VectorSource({
      features: geo_points
    });

    let vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({color: 'red'}),
        }),
      }),
    });

    return new Map({
      target: 'mapContainer',
      layers: [ new TileLayer({
          source: new OSM() }),
          vectorLayer ],
      view: new View({
        center: fromLonLat([2.896372, 44.60240]),
        zoom: 3
      })
    })
  }

}




export default function Mapa( { positions }) {

  const map = useRef(null)

  useEffect(() => {
    map.current = initialize_map(positions)
  })

  return(
    <div id="mapContainer" ref={map.current} style={{width: '80vw', height: '80vh'}}> </div>
  )
}
