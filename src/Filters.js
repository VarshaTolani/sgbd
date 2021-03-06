import React from 'react'

export default function Filters( { get_new_query }){
    return(
        <>

<table>
  <tr>
    <th>Distància</th>
	<th></th>
    <th>Tipus</th>
	<th></th>
    <th>Preu</th>
	<th></th>
    <th>Valoracio</th>
    <th></th>
    <th>Cerca</th>
  </tr>
  <tr>
    <td>
            <select id="distancia">
            <option selected value="0"> </option>
                <option value="1km">1km</option>
                <option value="2km">2km</option>
                <option value="100km">100km</option>
                <option value="200km">200km</option>
                <option value="500km">500km</option>
                <option value="1000km">1000km</option>
                <option value="10000km">10000km</option>
            </select>
	</td>
	<td></td>
    <td>
			<select id="tipus">
            <option selected value="sense tipus"> </option>
                <option value="Africana">Africana</option>
                <option value="Americana">Americana</option>
                <option value="Arab">Àrab</option>
                <option value="Espanyola">Espanyola</option>
                <option value="India">Hindú</option>
                <option value="Italiana">Italiana</option>
                <option value="Japonesa">Japonesa</option>
                <option value="Mexicana">Mexicana</option>
                <option value="Tailandesa">Tailandesa</option>
                <option value="Xinesa">Xinesa</option>
            </select>
	</td>
    <td></td>
	<td>
		<select id="preu">
            <option selected value="0"> </option>
                <option value="20">20€</option>
                <option value="40">40€</option>
                <option value="70">70€</option>
                <option value="100">100€</option>
            </select>
	</td>
	<td></td>
	<td>
			<select id="valoracio" name="Valoracio">
            <option selected value="0"> </option>
                <option value="1">1 estrella</option>
                <option value="2">2 estrelles</option>
                <option value="3">3 estrelles</option>
                <option value="4">4 estrelles</option>
                <option value="5">5 estrelles</option>
            </select>
	</td>
    <td></td>
    <td>
    <input type="text" id="nom" placeholder="Cerca per nom"></input>
    </td>
  </tr>
</table>

            <div>
                {get_new_query && <button onClick={get_new_query}>Buscar</button>}
            </div>
        </>
    )
}
