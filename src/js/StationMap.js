function StationMap(){

	this.stations = new Array();
	this.status = 0;
	
}

StationMap.prototype.init = function(){
	
	this.load_stations_metro();
	this.load_stations_bus();
	
}

StationMap.prototype.getStationById = function(id){
	
	for(i=0; i < this.stations.length; i++){			
		if(this.stations[i].id == id){
			return this.stations[i];
		}
	}
	
}

StationMap.prototype.load_stations_metro = function(data){
	
	if(data != undefined){
		
		data = data.results.bindings;
		for(i=0; i < data.length; i++){			
			this.stations.push(new Station(data[i].id.value, data[i].code.value, data[i].lat.value, data[i].long.value, data[i].name.value, 0));							
		}
		
		this.status ++;
		
		UX_UI.log("Cargadas "+data.length+" estaciones de Metro...");
		
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
		
		this.status++;
		
		UX_UI.log("Cargadas "+data.length+" estaciones de EMT...");
		
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
		
		//console.log(data);
		
		for(i=0; i < data.length; i++){
			
			acc = new Accessibility(data[i].typeBusStop ? {bus: data[i].typeBusStop.value} : undefined,
									data[i].specialPavementBorder ? data[i].specialPavementBorder.value  == 1 ? true : false : undefined,
									data[i].seats ? data[i].seats.value == 1 ? true : false : undefined,
									data[i].isquialSupports ? data[i].isquialSupports.value  == 1 ? true : false : undefined,
									data[i].spaceWheelchair ? data[i].spaceWheelchair.value  == 1 ? true : false : undefined,
									data[i].state ? data[i].state.value : undefined,
									data[i].dateLastAnnot ? data[i].dateLastAnnot.value : undefined);
			
			for(j = 0; j < this.stations.length; j++){
								
				if(data[i].id.value == this.stations[j].id){
					
					this.stations[j].acc_data = acc;
					
					//console.log(this.stations[j]);
					
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
		  optional {?busStop tran:dateLastAnnot ?dateLastAnnot} . \
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

StationMap.prototype.load_routes = function(st_arr, data){
	
	if(data != undefined){
		
		data = data.results.bindings;
		
		console.log(data);
		
		for(i=0; i < data.length; i++){
			
			for(j = 0; j < this.stations.length; j++){
								
				if(data[i].id.value == this.stations[j].id){
					
					this.stations[j].addroute(data[i].shortName.value, data[i].longName.value);
					
					console.log(this.stations[j]);
					
				}
				
			}
					
		}
			
		
	}else{
		
		bus_stops = st_arr.filter(function(i){ return i.type == 1 });
		metro_stops = st_arr.filter(function(i){ return i.type == 0 });
	
		q_bus = new SPARQL();
		
		qtxt = `PREFIX tran: <http://transacc.linkeddata.es/def/core#> 
				PREFIX gtfs: <http://vocab.gtfs.org/terms#>
				PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
				PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
				PREFIX foaf:<http://xmlns.com/foaf/0.1/> 
				PREFIX dct:<http://purl.org/dc/terms/>

					select * where { 
					?busStop gtfs:stopId ?id .
					filter(?id in ${q_bus.build_in(bus_stops)}) .
					?busStop rdf:type tran:BusStop .
				    ?busStop gtfs:Route ?route  . 
				    ?route gtfs:longName ?longName .
				    ?route gtfs:shortName ?shortName

				}`;
		
		console.log(qtxt);
			
		q_bus.query = qtxt;	
		q_bus.run(function(data){ SM.load_routes(bus_stops, data);}, this);
		
	}

}

StationMap.prototype.search = function(center, num){
	
	result = this.stations.slice();
	
	result.sort(function(a,b){ return a.dist(center)-b.dist(center);});
	
	result.slice(0,num);
		
	return result.slice(0,num);
	
}

StationMap.prototype.anotate = function(id,acc_data){
	
	qpart1 = "";
	
	acc_data.type && acc_data.type.bus ? qpart1 = qpart1 + "?ind tran:typeBusStop ?typeBusStop . ":undefined;
	acc_data.specialPavementBorder != undefined ? qpart1 = qpart1 + "?ind tran:specialPavementBorder ?specialPavementBorder . ":undefined;
	acc_data.seats != undefined ? qpart1 = qpart1 + "?ind tran:seats ?seats . ":undefined;
	acc_data.isquialSupports != undefined ? qpart1 = qpart1 + "?ind tran:isquialSupports ?isquialSupports . ":undefined;
	acc_data.spaceWheelchair != undefined ? qpart1 = qpart1 + "?ind tran:spaceWheelchair ?spaceWheelchair . ":undefined;
	acc_data.state ? qpart1 = qpart1 + "?ind tran:state ?state . ":undefined;
	acc_data.dateLastAnnot ? qpart1 = qpart1 + "?ind tran:dateLastAnnot ?dateLastAnnot . ":undefined;
	
	qpart1 = qpart1.substr(0, qpart1.length-2);
	
	qpart2 = "";
	
	acc_data.type && acc_data.type.bus ? qpart2 = qpart2 + "?ind tran:typeBusStop \""+acc_data.type.bus+"\" . ":undefined;
	acc_data.specialPavementBorder != undefined ? qpart2 = qpart2 + "?ind tran:specialPavementBorder \""+acc_data.specialPavementBorder+"\"^^xsd:boolean . ":undefined;
	acc_data.seats != undefined ? qpart2 = qpart2 + "?ind tran:seats \""+acc_data.seats+"\"^^xsd:boolean . ":undefined;
	acc_data.isquialSupports != undefined ? qpart2 = qpart2 + "?ind tran:isquialSupports \""+acc_data.isquialSupports+"\"^^xsd:boolean . ":undefined;
	acc_data.spaceWheelchair != undefined ? qpart2 = qpart2 + "?ind tran:spaceWheelchair \""+acc_data.spaceWheelchair+"\"^^xsd:boolean . ":undefined;
	acc_data.state ? qpart2 = qpart2 + "?ind tran:state \""+acc_data.state+"\" . ":undefined;
	acc_data.dateLastAnnot ? qpart2 = qpart2 + "?ind tran:dateLastAnnot \""+acc_data.dateLastAnnot+"\"^^xsd:date . ":undefined;
	
	qpart2 = qpart2.substr(0, qpart2.length-2);
	
	
	qtxt = `PREFIX tran: <http://transacc.linkeddata.es/def/core#> 
			PREFIX gtfs: <http://vocab.gtfs.org/terms#>
			PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

			WITH <http://localhost:8890/bus-emt>

			DELETE {   

				   ${qpart1}

			}

			INSERT {

				   ${qpart2}  
				
			}

			WHERE{ 

				   ?ind gtfs:stopId "${id}" .
				   optional{?ind tran:typeBusStop ?typeBusStop }. 
				   optional{?ind tran:specialPavementBorder ?specialPavementBorder }.  
				   optional{?ind tran:seats ?seats }. 
				   optional{?ind tran:isquialSupports ?isquialSupports }.  
				   optional{?ind tran:state ?state }. 
				   optional{?ind tran:dateLastAnnot ?dateLastAnnot }.  
				   optional{?ind tran:spaceWheelchair ?spaceWheelchair}
				
			}`;
			
		console.log(qtxt);
		
		q = new SPARQL(qtxt);
		
		q.run();
}
