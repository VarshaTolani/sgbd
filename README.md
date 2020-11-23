# sgbd
Cerca de restaurants

De:\
Pau Casademont\
Varsha Tolani\
Jordi Gomara\
Roger Canet\



/* COMANDES */
- Elastic: .\bin\elasticsearch.bat
- Kibana: .\bin\kibana.bat
- npm start (executar app)
- npm install ol (IMPORTANT pel mapa)

/* IMPORTAR DADES */
- Descarregar [logstash](https://www.elastic.co/es/downloads/logstash)
- Crear l'index restaurants des de Kibana amb les instruccions del fitxer sgbd\\elasticsearch\\create_index
- Eliminar la primera linia del fitxer csv i opcionalment els caracters "\[" i  "\]"
- Baixar el fitxer sgbd\\elasticsearch\\pipeline.conf i a on posa "path => " afegir el path del fitxer .csv
- Obrir el terminal a un directori on hi hagi el fitxer pipeline.conf i executar: "path_a_logstash"\\bin\\logstash -f pipeline.conf (cal tenir ES engegat)
