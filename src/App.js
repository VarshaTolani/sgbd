import React, { useState, useEffect } from 'react';
import Map from './Map'
import axios from 'axios'



function App() {
  
  const url = "http://localhost:9200/restaurants/_search"

  const query = {
                  "_source": ["nom","localitzacio"],
                  "size": 10000,
                  "query": {
                    "bool": {
                      "must": {
                        "match_all": {}
                      }
                    }
                  }
                };


  const [positions, setPositions] = useState(null)

  useEffect(() => {
    let cancel
    axios.post(url, query, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setPositions(res.data.hits.hits.map(res => res._source.localitzacio))
    }).catch(error => console.log('ERROR: ', error.response))
    return () => cancel() 
  }, [url])

  return (
    <Map  positions = {positions}/>
  )
}

export default App;
