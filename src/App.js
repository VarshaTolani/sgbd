import React, { useState, useEffect } from 'react';
import Map from './Map'
import Filters from './Filters'
import axios from 'axios'


function App() {

  const url = "http://localhost:9200/restaurants/_search"
  const [query, setQuery] = useState(null)
  const [positions, setPositions] = useState(null)

  function set_filters_query(){

    let filters = []
    var currentCoordinates = [41.60240, 2.896372];

    if(document.getElementById("distancia").value !== "0"){
      filters.push(
          {
            "geo_distance": {
              "distance": document.getElementById("distancia").value,
              "localitzacio":
              {
                "lat": 90,
                "lon": 137
              }
            }
          }
      )
    }

    if(document.getElementById("tipus").value !== "sense tipus"){
      filters.push(
        {
          "term": {
            "categoria": document.getElementById("tipus").value
          }
        }
      )
    }

    if(document.getElementById("preu").value !== "0"){
      filters.push(
        {
          "term": {
            "preu": document.getElementById("preu").value
          }
        }
      )
    }

    if(document.getElementById("valoracio").value !== "0"){
      filters.push(
        {
          "term": {
            "valoracio": document.getElementById("valoracio").value
          }
        }
      )
    }

    return filters
  }

  function get_new_query(){

      const filters = set_filters_query()

      setQuery( {
        "_source": ["nom","localitzacio"],
        "size": 10000,
        "query": {
          "bool": {
            "must": {
              "match_all": {}
            },
            "filter": filters
          }
        }
      });
  }

  useEffect(() => {
    if(query){
      let cancel
      axios.post(url, query, {
        cancelToken: new axios.CancelToken(c => cancel = c)
      }).then(res => {
        setPositions(res.data.hits.hits.map(res => res._source.localitzacio))
      }).catch(error => console.log('ERROR: ', error.response))
      return () => cancel()
    }
  }, [query])

  return (
    <>
      <Filters get_new_query={get_new_query}/>
      <Map  positions = {positions}/>
    </>
  )
}

export default App;
