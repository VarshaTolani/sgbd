import React from 'react'
import { GoogleMap, 
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
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={ <div style={{ height: "100%" }} /> }
            containerElement={ <div style={{ height: "100%" }} /> }
            mapElement={ <div style={{ height: "100%" }} /> }
        /> 
      </div>
    )
}