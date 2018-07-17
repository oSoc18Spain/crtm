var MAX_RESULTS = 15;

function UI(){

	this.view = {level: 1, info: ""};
	
}

UI.prototype.search = function(stp, data){
	
	if(stp == undefined){ // Se convierte el texto a unas coordenadas, geocodificación
		
		txt = document.getElementById('search').value;
		GM.geocode(txt, function(data){ UX_UI.search(1,data);});
		
		r = document.getElementsByClassName("result-row")

		while(r.length > 0){
			r[0].remove();
		}
		
	}
	
	if(stp == 1){ // Se pasan las coordenadas a la matriz de estaciones para obtener las cercanas
		
		ll = {
				lat: data[0].geometry.location.lat(), 
				lng: data[0].geometry.location.lng()
			};

		sl = SM.search(ll, MAX_RESULTS);
		
		SM.load_acc(sl);
		
		GM.cleanstation();
		GM.addstation(sl);
		
		document.getElementById('results-button').style.display = ""
			sl.forEach(function(elm, idx){
				var result = document.getElementById('result-row')
				var clone = result.cloneNode(true)
				clone.classList.add('result-row')
				clone.style.display = ""
				clone.id = result.id + idx
				clone.addEventListener('click', function(id){ 
					return function(){
						UX_UI.show_station(id);
					}	
				}(elm.id));
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
			
	}
}

UI.prototype.show_station = function(id){
	
	alert("Se muestra la estación con id: "+id);

}

UI.prototype.show_anotate = function(uri){
	
	alert("Se muestra la pantalla de anotación para el id: "+id);

}

UI.prototype.setCookie = function(elm, cname){
	if(elm.id == 'set-cookie-button'){
		var value = document.getElementById('disability-option').value

		if(value != ""){
			localStorage.setItem(cname, value);
		}
	}
	var welcomeScreen = document.getElementById('welcome-screen')
	welcomeScreen.style['z-index'] = -1
}

UI.prototype.checkCookie = function(cname){
	var cvalue = localStorage.getItem(cname);
    if (cname = 'disability' && cvalue != null) {
    	var welcomeScreen = document.getElementById('welcome-screen')
    	welcomeScreen.style['z-index'] = -1
    }
}


