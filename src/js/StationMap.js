function StationMap(){

	this.stations = new Array();
	
}

StationMap.prototype.init = function(){
	
	this.load_stations_metro();
	this.load_stations_bus();
	
}

StationMap.prototype.load_stations_metro = function(){

	qtxt = "PREFIX tran: <http://www.semanticweb.org/edna/ontologies/2018/transportAccessibility#> \
	select * where { \
	?class rdf:type <http://transacc.linkeddata.es/def/core#MetroStop> . \
	?class geo:lat ?lat . \
	?class geo:long ?long . \
	?class <http://vocab.gtfs.org/terms#code> ?code . \
	?class foaf:name ?name }";
	
	q = new SPARQL(qtxt);	
	q.run(this.load_stations_metro_cb, this);
	
}

StationMap.prototype.load_stations_metro_cb = function(data){

	data = data.results.bindings;
	for(i=0; i < data.length; i++){			
		this.stations.push(new Station(data[i].class.value, data[i].code.value, data[i].lat.value, data[i].long.value, data[i].name.value, 0));							
	}
	console.log("Loaded "+data.length+" Metro stops");
	
}

StationMap.prototype.load_stations_bus = function(){

	qtxt = "PREFIX tran: <http://www.semanticweb.org/edna/ontologies/2018/transportAccessibility#> \
	select * where { \
	?class rdf:type <http://transacc.linkeddata.es/def/core#BusStop> . \
	?class geo:lat ?lat . \
	?class geo:long ?long . \
	?class <http://vocab.gtfs.org/terms#code> ?code . \
	?class foaf:name ?name }";
	
	q = new SPARQL(qtxt);	
	q.run(this.load_stations_bus_cb, this);
	
}

StationMap.prototype.load_stations_bus_cb = function(data){

	data = data.results.bindings;
	for(i=0; i < data.length; i++){			
		this.stations.push(new Station(data[i].class.value, data[i].code.value, data[i].lat.value, data[i].long.value, data[i].name.value, 1));							
	}
	console.log("Loaded "+data.length+" Bus stops");
	
}

StationMap.prototype.search = function(center, num){
	
	result = this.stations.slice();
	
	result.sort(function(a,b){ return a.dist(center)-b.dist(center);});
	
	result.slice(0,num);
	
	console.log(result.slice(0,num));
	
	return result.slice(0,num);
	
}

