import React, { useState, useEffect } from 'react';
import Map from './Map'
import Filters from './Filters'
import axios from 'axios'

const url = "http://localhost:9200/restaurants"
const max_num_restaurants = 10000
var currentCoordinates = null
var currentRestaurant = null;

function App() {


  const [query, setQuery] = useState(null)
  const [restaurants, setRestaurants] = useState(null)
  const [query2, setQuery2] = useState(null)
  const [menu, setMenu] = useState({
                                      isOpen: false,
                                      primers: [],
                                      segons: [],
                                      postres: [],
                                      begudes: []
                                    })


  function setCurrentCoordinates(coordinates){
    currentCoordinates = coordinates
  }

  function get_new_menu(restaurant_id){
  
    axios.get(url + '/_doc/' + restaurant_id, {      
    }).then(res => {

      setMenu({
        isOpen: true,
        primers: res.data._source.primers.split(','),
        segons: res.data._source.segons.split(','),
        postres: res.data._source.postres.split(','),
        begudes: res.data._source.begudes.split(',')
      })

    }).catch(error => console.log('ERROR: ', error.response))    
  }


  function set_filters_query(){

    let filters = []


    if(document.getElementById("distancia").value !== "0" && currentCoordinates){
      filters.push(
          {
            "geo_distance": {
              "distance": document.getElementById("distancia").value,
              "localitzacio":
              {
                "lat": currentCoordinates[0],
                "lon": currentCoordinates[1]
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

    if(document.getElementById("nom").value !== ""){
      var ast = "*"
      var nom = ast.concat(document.getElementById("nom").value,ast);
      filters.push(
        {
          "query_string": {
            "query": nom,
            "default_field": "nom"
          }

        }
      )
    }

    return filters
  }


  function get_new_query(){

      const filters = set_filters_query()

      setQuery( {
        "_source": ["nom","localitzacio","categoria"],
        "size": max_num_restaurants,
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
      axios.post(url + '/_search', query, {
        cancelToken: new axios.CancelToken(c => cancel = c)
      }).then(res => {

        setRestaurants(res.data.hits.hits)

      }).catch(error => console.log('ERROR: ', error.response))
      return () => cancel()
    }

  }, [query])


  return (
    <>
      <Filters get_new_query={get_new_query}/>
      <Map
        restaurants = {restaurants}
        menu = {menu}
        setCurrentCoordinates = {setCurrentCoordinates}
        get_new_menu = {get_new_menu}
      />
    </>
  )
}

export default App;
