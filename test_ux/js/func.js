// Cálculo de la distancia entre dos coordenadas

function ll2distance(coord1, coord2){
	
	lat1 = coord1["lat"];
	lon1 = coord1["lng"];
	lat2 = coord2["lat"];
	lon2 = coord2["lng"];

	var R = 6371000;
	var φ1 = deg2rad(lat1);
	var φ2 = deg2rad(lat2);
	var Δφ = deg2rad(lat2-lat1);
	var Δλ = deg2rad(lon2-lon1);
	
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
			Math.cos(φ1) * Math.cos(φ2) *
			Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;

}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

// Aux

function station2ll(station){

return {
	lat: parseFloat(station.lat.value),
	lng: parseFloat(station.long.value)
	};

}

// Consultas SPARQL

function sparql(query){
	
	result = null;
	
	$.ajax({
		data: {"query" : query, "format" : "json"},
		type: "GET",
		async: false,
		dataType: "json",
		success: function(data) {
			result = data.results.bindings;
			console.log(result);
		},
		url: "http://oasis.summerofcode.oeg-upm.net/sparql",
	});
	
	return result;
		
}



