# SISTEMES DE GESTIÓ DE BASES DE DADES
## Projecte: ElasticChef

Aplicació web per la cerca de restaurants: disposa d'un mapa amb marcadors que mostra els restaurants seleccionats. Permet filtrar-los per una sèrie de variables: categoria, preu, distància, etc.

**Autors:**
- *Pau Casademont*
- *Varsha Tolani*
- *Jordi Gomara*
- *Roger Canet*

### INFORMACIÓ IMPORTANT

### Comandes per l'execució
- **Execució per l'ElasticSearch**: .\bin\elasticsearch.bat
- **Execució del Kibana**: .\bin\kibana.bat
- **Execució del programa**: npm start (Des del directori amb els .js)

### Comandes d'instal·lació
- **Instal·lació OpenLayers**: npm install ol (IMPORTANT pel mapa)
- **Instal·lació d'Axios**: npm install axios (per connexió amb ES)
- **Extensio chrome [Moesif CROS]**: https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc

### Importació de dades
- **Descarregar [logstash]**: (https://www.elastic.co/es/downloads/logstash)
- Crear l'index restaurants des de Kibana amb les instruccions del fitxer sgbd\\elasticsearch\\create_index
- Baixar el fitxer sgbd\\elasticsearch\\pipeline.conf i a on posa "path => " afegir el path del fitxer .csv
- Obrir el terminal a un directori on hi hagi el fitxer pipeline.conf i executar: "path_a_logstash"\\bin\\logstash -f pipeline.conf (cal tenir ES engegat)

