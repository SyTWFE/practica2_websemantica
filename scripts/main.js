var resultados =[];
resultados = {
	persona:"",
	personaLabel:"",
	birthLabel:""
};
var cantidad;
var option;

var select = document.getElementById('select');
select.addEventListener('change',
  function(){
    var selectedOption = this.options[select.selectedIndex];
    option=selectedOption.value;
  });

class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `SELECT ?person ?personLabel ?birthPlaceLabel WHERE {
	?person wdt:P69 wd:Q539881.
	?person wdt:P106 wd:Q82955.
	?person wdt:P19 ?birthPlace. 
	SERVICE wikibase:label { bd:serviceParam wikibase:language "es". }
  }`;

var queryDispatcher;
queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
queryDispatcher.query( sparqlQuery )
	.then(
		function(value) {
			console.log("Query resuelto");
			iterarJson(value);
		},
		function(reason) {
			console.log("Error:" +reason);
		}
	);


function iterarJson(value){
	cantidad = parseInt(value["results"]["bindings"].length);
	for(var i=0; i<cantidad; i++){
		resultados[i]={
			persona: value["results"]["bindings"][i]["person"]["value"],
			personaLabel: value["results"]["bindings"][i]["personLabel"]["value"],
			birthLabel: value["results"]["bindings"][i]["birthPlaceLabel"]["value"]
		}
	}	
}

function mostrarResultados(){
	var div = document.getElementById("resultados");
	div.innerHTML="";
	for(var i=1; i<cantidad; i++){
		var personElement = document.createElement("p");
		var textPersonElement = document.createTextNode(""+resultados[i].persona);
		personElement.appendChild(textPersonElement);

		var personaLabelElement = document.createElement("p");
		var textPersonaLabelElement = document.createTextNode(""+resultados[i].personaLabel);
		personaLabelElement.appendChild(textPersonaLabelElement);

		var birthLabelElement = document.createElement("p");
		var textBirthLabelElement = document.createTextNode(""+resultados[i].birthLabel);
		birthLabelElement.appendChild(textBirthLabelElement);

		div.appendChild(personElement);
		div.appendChild(personaLabelElement);
		div.appendChild(birthLabelElement);
	}
}



