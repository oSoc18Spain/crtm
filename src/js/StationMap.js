function StationMap(){

	this.stations = new Array();
	
}

StationMap.prototype.init = function(){
	
	this.load_stations_metro();
	this.load_stations_bus();
	
}

StationMap.prototype.load_stations_metro = function(data){
	
	if(data != undefined){
		
		data = data.results.bindings;
		for(i=0; i < data.length; i++){			
			this.stations.push(new Station(data[i].id.value, data[i].code.value, data[i].lat.value, data[i].long.value, data[i].name.value, 0));							
		}
		console.log("Loaded "+data.length+" Metro stops");
		
	}else{

		qtxt = "PREFIX tran: <http://www.semanticweb.org/edna/ontologies/2018/transportAccessibility#> \
		select * where { \
		?class rdf:type <http://transacc.linkeddata.es/def/core#MetroStop> . \
		?class <http://vocab.gtfs.org/terms#stopId> ?id . \
		?class geo:lat ?lat . \
		?class geo:long ?long . \
		?class <http://vocab.gtfs.org/terms#code> ?code . \
		?class foaf:name ?name }";
		
		q = new SPARQL(qtxt);	
		q.run(this.load_stations_metro, this);
		
	}
	
}

StationMap.prototype.load_stations_bus = function(data){
	
	if(data != undefined){
		
		data = data.results.bindings;
		for(i=0; i < data.length; i++){			
			this.stations.push(new Station(data[i].id.value, data[i].code.value, data[i].lat.value, data[i].long.value, data[i].name.value, 1));							
		}
		console.log("Loaded "+data.length+" Bus stops");
		
	}else{
		
		qtxt = "PREFIX tran: <http://www.semanticweb.org/edna/ontologies/2018/transportAccessibility#> \
		select * where { \
		?class rdf:type <http://transacc.linkeddata.es/def/core#BusStop> . \
		?class <http://vocab.gtfs.org/terms#stopId> ?id . \
		?class geo:lat ?lat . \
		?class geo:long ?long . \
		?class <http://vocab.gtfs.org/terms#code> ?code . \
		?class foaf:name ?name }";
		
		q = new SPARQL(qtxt);	
		q.run(this.load_stations_bus, this);
		
	}
	
}

StationMap.prototype.load_acc = function(st_arr, data){
	
	if(data != undefined){
		
		data = data.results.bindings;
		
		console.log(data);
		
		for(i=0; i < data.length; i++){
			
			acc = new Accessibility(data[i].typeBusStop ? data[i].typeBusStop.value : undefined,
									data[i].specialPavementBorder ? data[i].specialPavementBorder.value : undefined,
									data[i].seats ? data[i].seats.value : undefined,
									data[i].isquialSupports ? data[i].isquialSupports.value : undefined,
									data[i].spaceWheelchair ? data[i].spaceWheelchair.value : undefined,
									data[i].state ? data[i].state.value : undefined);
			
			for(j = 0; j < this.stations.length; j++){
								
				if(data[i].id.value == this.stations[j].id){
					
					this.stations[j].acc_data = acc;
					
					console.log(this.stations[j]);
					
				}
				
			}
					
		}
			
		
	}else{
		
		bus_stops = st_arr.filter(function(i){ return i.type == 1 });
		metro_stops = st_arr.filter(function(i){ return i.type == 0 });
	
		q_bus = new SPARQL();
		
		qtxt = "PREFIX tran: <http://transacc.linkeddata.es/def/core#> \
		PREFIX gtfs: <http://vocab.gtfs.org/terms#>\
		PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\
		PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
		PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
		select * where { \
		?busStop rdf:type tran:BusStop . \
		?busStop geo:lat ?lat . \
		?busStop geo:long ?long . \
		?busStop gtfs:stopId ?id .\
		filter(?id in "+q_bus.build_in(bus_stops)+") .\
		?busStop gtfs:code ?code . \
		?busStop foaf:name ?name . \
		?busStop gtfs:weelchairAccessible ?weelchairAccessible . \
		  optional {?busStop tran:typeBusStop ?typeBusStop} . \
		  optional {?busStop tran:specialPavementBorder ?specialPavementBorder} . \
		  optional {?busStop tran:seats ?seats} . \
		  optional {?busStop tran:isquialSupports ?isquialSupports} . \
		  optional {?busStop tran:state ?state} . \
		  optional {?busStop tran:spaceWheelchair ?spaceWheelchair} \
		}";
		
		console.log(qtxt);
			
		q_bus.query = qtxt;	
		q_bus.run(function(data){ SM.load_acc(bus_stops, data);}, this);
		
		/*
		
		q_metro = new SPARQL();
		
		qtxt = "PREFIX tran: <http://transacc.linkeddata.es/def/core#> \
				PREFIX gtfs: <http://vocab.gtfs.org/terms#>\
				PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\
				PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
				PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
				PREFIX dct:<http://purl.org/dc/terms/>\
					select * where {\
					?ind a tran:Platform .    \
					?ind tran:toRoute ?route  .\
					?ind tran:toStation ?station .\
					?station gtfs: 'COLOMBIA' .\
					?ind tran:headsign ?headsign .\
					?station foaf:name ?name .\
					?route gtfs:shortName ?lineNum . \
					?route gtfs:longName ?lineName .\
				   optional {?ind tran:typePlatform ?type} . \
				  optional {?ind tran:specialPavementBorder ?spb} . \
				  optional {?ind tran:seats ?seats} . \
				  optional {?ind tran:isquialSupports ?isquial} . \
				  optional {?ind tran:spaceWheelchair ?spacew} \
				}";
						
		console.log(qtxt);
			
		q_metro.query = qtxt;	
		q_metro.run(function(data){ SM.load_acc(metro_stops, data);}, this);
		* 
		*/
		
	}

}

StationMap.prototype.search = function(center, num){
	
	result = this.stations.slice();
	
	result.sort(function(a,b){ return a.dist(center)-b.dist(center);});
	
	result.slice(0,num);
		
	return result.slice(0,num);
	
}

