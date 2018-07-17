var MAX_RESULTS = 15;

function UI(){

	this.view = {level: 1, info: ""};
	
}

UI.prototype.search = function(stp, data){
	
	if(stp == undefined){ // Se convierte el texto a unas coordenadas, geocodificación
		
		txt = document.getElementById('search').value;
		GM.geocode(txt, function(data){ UX_UI.search(1,data);});
		
	}
	
	if(stp == 1){ // Se pasan las coordenadas a la matriz de estaciones para obtener las cercanas
		
		ll = {
				lat: data[0].geometry.location.lat(), 
				lng: data[0].geometry.location.lng()
			};

		sl = SM.search(ll, MAX_RESULTS)
		
		GM.addstation(sl);
			
	}
	
	/*		ll = {
				lat: results[0].geometry.location.lat(), 
				lng: results[0].geometry.location.lng()
			};

			sl = SM.search(ll, MAX_RESULTS)

			addstation(sl);

			document.getElementById('results-button').style.display = ""
			console.log(sl)
			sl.forEach(function(elm, idx){
				var result = document.getElementById('result-row')
				var clone = result.cloneNode(true)
				clone.classList.add('result-row')
				clone.style.display = ""
				clone.id = result.id + idx
				var icon = clone.getElementsByClassName("col-md-1")[0]

				if(elm['type'] == 0){
					icon.classList.add("fas")
					icon.classList.add("fa-subway")
					icon.classList.add("fa-lg")
				}
				else{
					icon.classList.add("fas")
					icon.classList.add("fa-bus")
					icon.classList.add("fa-lg")
				}
				var typeStation = clone.getElementsByClassName("col-md-4")[0]
				typeStation.innerHTML = elm['name']
				result.parentNode.appendChild(clone)
		});

		*/


}

UI.prototype.station = function(uri){


}

UI.prototype.anotate = function(uri){

}
