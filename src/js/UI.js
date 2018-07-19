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

				var clone = createResultRow(idx)
				clone.addEventListener('click', function(id){ 
					return function(){
						UX_UI.show_station(id);
					}	
				}(elm.id));
				var icon = clone.getElementsByClassName("col-xs-1")[0]

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
				var typeStation = clone.getElementsByClassName("col-xs-4")[0]
				typeStation.innerHTML = elm['name']
				document.getElementById('results').appendChild(clone)
		});
			
	}

	function createResultRow(idx){
		var resultDiv = document.createElement('div')
		resultDiv.className = 'row'
		resultDiv.id = "result-row" + idx
		resultDiv.style.padding = "1em"
		resultDiv.style.margin = "0"

		var iconDiv = document.createElement('div')
		iconDiv.className = 'col-xs-1'
		iconDiv.style['margin-right'] = "1em"

		var nameDiv = document.createElement('div')
		nameDiv.className = 'col-xs-4'

		var extraDiv = document.createElement('div')
		extraDiv.className = 'col-xs-7'

		resultDiv.appendChild(iconDiv)
		resultDiv.appendChild(nameDiv)
		resultDiv.appendChild(extraDiv)

		return resultDiv
	}
}

UI.prototype.show_station = function(id){
	
	console.log("Show station: "+id);

	var c = SM.stations.filter(station => station.id == id)[0];

	bounds = new google.maps.LatLngBounds();
	DM = new GMaps();
	DM.init('second_map');

	bounds.extend(c.coord());

	c.access.forEach(function(ac){
		a_marker = new google.maps.Marker({
			position: ac.coord(),
			map: DM.map,
			title: ac.name
		}); 
		bounds.extend(ac.coord());
	})

	marker = new google.maps.Marker({
			position: c.coord(),
			map: DM.map,
			title: c.name
	});

	DM.map.fitBounds(bounds)

	//Avoid excessive zoom when a station is displayed
	if (c.type == 1)	//Bus station
		DM.map.setZoom(DM.map.getZoom() - 2)

	UX_UI.displayScreen('station_slide');
}
	
UI.prototype.show_anotate = function(uri){
	
	alert("Se muestra la pantalla de anotación para el id: " + id);

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
    else
    	UX_UI.displayScreen('welcome-screen')
}

UI.prototype.displayScreen = function(id_screen){

	slides = document.getElementsByClassName('slide')

	for (var i = 0 ; i < slides.length ; i++){
		if(id_screen == slides[i].id){
			screen = document.getElementById(id_screen)
			screen.style.display = ""
			screen.style['z-index'] = 1
		}
		else{
			slides[i].style['z-index'] = 0
		}
	}
		
}


