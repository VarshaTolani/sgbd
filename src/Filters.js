import React from 'react'

export default function Filters( { get_new_query }){
    return(
        <>

            <p> </p>        
            <label>Distància Maxima</label>
            <p> </p>   
            <select id="distancia">
            <option selected value="0"> </option>
                <option value="1km">1km</option>
                <option value="2km">2km</option>
                <option value="100km">100km</option>
                <option value="10000km">10000km</option>
            </select>            
            <p> </p>

            <p> </p>        
            <label>Tipus</label>
            <p> </p>   
            <select id="tipus">
            <option selected value="sense tipus"> </option>
                <option value="Italiana">Italiana</option>
                <option value="Japonesa">Japonesa</option>
                <option value="Mexicana">Mexicana</option>
            </select>            
            <p> </p>
            
            <label>Escull el preu</label>
            <p> </p>
            <select id="preu">
            <option selected value="0"> </option>
                <option value="20">20€</option> 
                <option value="40">40€</option> 
                <option value="70">70€</option> 
                <option value="100">100€</option> 
            </select>
            
            <p> </p>
            
            <label for="Valoracio">Escull la valoració</label>
            <p> </p>
            <select id="valoracio" name="Valoracio">
            <option selected value="0"> </option> 
                <option value="1">1 estrella</option> 
                <option value="2">2 estrelles</option> 
                <option value="3">3 estrelles</option> 
                <option value="4">4 estrelles</option> 
                <option value="5">5 estrelles</option> 
            </select>            
            <p> </p>
            <div>
                {get_new_query && <button onClick={get_new_query}>Buscar</button>}
            </div>
        </>
    )
}