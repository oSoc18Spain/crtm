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
	?class <http://vocab.gtfs.org/terms#stopId> ?id . \
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
		this.stations.push(new Station(data[i].id.value, data[i].code.value, data[i].lat.value, data[i].long.value, data[i].name.value, 0));							
	}
	console.log("Loaded "+data.length+" Metro stops");
	
}

StationMap.prototype.load_stations_bus = function(){

	qtxt = "PREFIX tran: <http://www.semanticweb.org/edna/ontologies/2018/transportAccessibility#> \
	select * where { \
	?class rdf:type <http://transacc.linkeddata.es/def/core#BusStop> . \
	?class <http://vocab.gtfs.org/terms#stopId> ?id . \
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
		this.stations.push(new Station(data[i].id.value, data[i].code.value, data[i].lat.value, data[i].long.value, data[i].name.value, 1));							
	}
	console.log("Loaded "+data.length+" Bus stops");
	
}

StationMap.prototype.load_acc = function(st_arr){
	
	q = "PREFIX tran: <http://transacc.linkeddata.es/def/core#> \
	PREFIX gtfs: <http://vocab.gtfs.org/terms#>\
	PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\
	PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
	PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
    select * where { \
    ?busStop rdf:type tran:BusStop . \
    ?busStop geo:lat ?lat . \
    ?busStop geo:long ?long . \
    ?busStop gtfs:stopId ?id .\
    filter(?id in ('par_6_4850','par_6_2512')) .\
    ?busStop gtfs:code ?code . \
    ?busStop foaf:name ?name . \
    ?busStop gtfs:weelchairAccessible ?weelchairAccessible . \
	  optional {?busStop tran:typeBusStop ?typeBusStop} . \
	  optional {?busStop tran:specialPavementBorder ?specialPavementBorder} . \
	  optional {?busStop tran:seats ?seats} . \
	  optional {?busStop tran:isquialSupports ?isquialSupports} . \
	  optional {?busStop tran:spaceWheelchair ?spaceWheelchair} \
	}";

}

StationMap.prototype.search = function(center, num){
	
	result = this.stations.slice();
	
	result.sort(function(a,b){ return a.dist(center)-b.dist(center);});
	
	result.slice(0,num);
	
	console.log(result.slice(0,num));
	
	return result.slice(0,num);
	
}

