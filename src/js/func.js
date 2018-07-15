

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


function station2ll(station){

return {
	lat: parseFloat(station.lat.value),
	lng: parseFloat(station.long.value)
	};

}

// Consultas SPARQL





