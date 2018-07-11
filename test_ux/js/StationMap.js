function StationMap(){

	this.stations = new Array();
	
}

StationMap.prototype.init = function(){
	
	this.load_stations_metro();
	
}

StationMap.prototype.load_stations_metro = function(){

	q = new SPARQL("PREFIX tran: <http://www.semanticweb.org/edna/ontologies/2018/transportAccessibility#> select * where { ?class rdf:type tran:TrainStop . ?class geo:lat ?lat . ?class geo:long ?long . ?class foaf:name ?name }");	
	q.run(this.load_stations_metro_cb, this);
	
}

StationMap.prototype.load_stations_metro_cb = function(data){

	data = data.results.bindings;
	for(i=0; i < data.length; i++){			
		this.stations.push(new Station(data[i].class.value, data[i].lat.value, data[i].long.value, data[i].name.value, 0));							
	}
	console.log("Loaded "+data.length+" Metro stations");
	
}


StationMap.prototype.search = function(center, distance){
	
}
