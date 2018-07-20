var MAX_RESULTS = 15;
var cs;

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
	
	if(stp == 0){
		
		if(G.status == 2){
			
			document.getElementById("search").value = "";
			
			r = document.getElementsByClassName("result-row")

			while(r.length > 0){
				r[0].remove();
			}
			
			UX_UI.search(1,undefined);
			
			
		}else{
			
			console.log("Geolocation not working");
			
		}
		
	}
		
	
	if(stp == 1){ // Se pasan las coordenadas a la matriz de estaciones para obtener las cercanas
		
		if(data != undefined){
		
		ll = {
				lat: data[0].geometry.location.lat(), 
				lng: data[0].geometry.location.lng()
			};
			
		}else{
			
			ll = G.position;
			
		}

		sl = SM.search(ll, MAX_RESULTS);
		
		SM.load_acc(sl);
		
		SM.load_routes(sl);
		
		GM.cleanstation();
		
		int = setInterval(function(){ if(sl[0].acc_data != undefined){ GM.addstation(sl); clearInterval(int);} }, 500);
		
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
				typeStation.innerHTML = elm['name'] + " (" + elm['code'] + ")" 
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


	displayGeneralInfoStation(id)

	UX_UI.displayScreen('station_slide');
	btn_general = document.getElementById('btn-general-results-detail');
	btn_accesibility = document.getElementById('btn-accesibility-results-detail')
	btn_general.addEventListener('click', function(id){ 
					return function(){
						btn_general.focus();
						UX_UI.displayStationTab(id);
					}
				}('general-results-detail'));
	btn_accesibility.addEventListener('click', function(id){ 
					return function(){
						btn_accesibility.focus();
						UX_UI.displayStationTab(id);
					}
				}('accesibility-results-detail'));

	btn_general.click();

	function displayGeneralInfoStation(id_station){

		cs = SM.getStationById(id_station)
		document.getElementById('station-title').innerHTML = cs.name + " (" + cs.code + ")"

		results_elems = document.getElementById('general-results-detail').getElementsByClassName('row')[0]
		results_elems.innerHTML = ""
		i = document.createElement('p')
		i.innerHTML = "Lineas asociadas a esta parada:"
		results_elems.appendChild(i)

		cs.routes.forEach(function(r){
			routePrgh = document.createElement('p')
			routePrgh.innerHTML = r['code'] + ": " + r['name']
			results_elems.appendChild(routePrgh)
		})


		acc_elems = document.getElementById('accesibility-results-detail').getElementsByClassName('row')

		for (var i = 0; i < acc_elems.length ; i++){
			
			if (acc_elems[i].getElementsByClassName('row').length > 0)
				acc_elems[i].getElementsByClassName('row')[0].remove();
			d = document.createElement('div')
			d.className = "row fas"

			if(acc_elems[i].id == 'stop-type'){
				if(cs.acc_data.type == undefined){
					d.classList.add('fas')
					d.classList.add('fa-question')
				}
				else if('bus' in cs.acc_data.type && cs.acc_data.type['bus'] == 'roof'){
					d.innerHTML = "Marquesina"
				}
				else if('bus' in cs.acc_data.type && cs.acc_data.type['bus'] != 'roof'){
					d.innerHTML = "Poste"
				}
				acc_elems[i].appendChild(d)
			}
			
			if (acc_elems[i].id == 'acc-seats'){
				if (cs.acc_data.seats == undefined)
					d.classList.add('fa-question')
				else if(cs.acc_data.seats == false)
					d.classList.add('fa-times')
				else
					d.classList.add('fa-check')
				acc_elems[i].appendChild(d)
			}
			else if (acc_elems[i].id == 'acc-isquial-sup'){
				if (cs.acc_data.isquialSupports == undefined)
					d.classList.add('fa-question')
				else if(cs.acc_data.isquialSupports == false)
					d.classList.add('fa-times')
				else
					d.classList.add('fa-check')
				acc_elems[i].appendChild(d)
			} 
			else if (acc_elems[i].id == 'acc-pavement'){
				if (cs.acc_data.specialPavementBorder == undefined)
					d.classList.add('fa-question')
				else if(cs.acc_data.specialPavementBorder == false)
					d.classList.add('fa-times')
				else
					d.classList.add('fa-check')
				acc_elems[i].appendChild(d)
			}
			else if (acc_elems[i].id == 'acc-wheelchair'){
				if (cs.acc_data.spaceWheelchair == undefined)
					d.classList.add('fa-question')
				else if(cs.acc_data.spaceWheelchair == false)
					d.classList.add('fa-times')
				else
					d.classList.add('fa-check')
				acc_elems[i].appendChild(d)
			}
		}		

	}
}
	
UI.prototype.show_anotate = function(uri){
	
	alert("Se muestra la pantalla de anotación para el id: " + id);
	cs = SM.getStationById(id_station)
	document.getElementById('station-title').innerHTML = cs.name + " (" + cs.code + ")"
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

UI.prototype.displayStationTab = function(id_tab){
	s = document.getElementById('station_slide')
	ab = document.getElementById('anotate-button')
	dateDiv = document.getElementById('last-modification-date')
	tabs = s.getElementsByClassName('tab')
	t = document.getElementById(id_tab)
	t.style.height = screen.offsetHeight - document.getElementById('results-header').offsetHeight + "px"

	for (var i = 0 ; i < tabs.length ; i++){
		if(id_tab == tabs[i].id){
			t.style.display = ""
			t.style['z-index'] = 1
			ab.style['z-index'] = 1
			dateDiv.style['z-index'] = 1
			dateDiv.innerHTML = ""
			lastModDateText = document.createElement('i')
			lastModDateText.innerHTML = "Ultima modificación: " + (cs.acc_data.dateLastAnnot == undefined ? "No definida" : cs.acc_data.dateLastAnnot)
			dateDiv.appendChild(lastModDateText)
		}
		else{
			tabs[i].style['z-index'] = 0
		}
	}

}

UI.prototype.log = function(txt){
	
	document.getElementById("loading_msg").innerHTML = txt;
	
}

UI.prototype.selectAnnotation = function(htmlElem){

	sendButton = document.getElementById('send-button')
	accessibilityOption = document.getElementById('accessibility-option')
	accessibilityAttribute = document.getElementById('accessibility-attribute')

	if(htmlElem.id == "accessibility-attribute"){
		accessibilityOption.style.display = ""
		msg = document.getElementById('accessibility-msg')
		
		if(htmlElem.value.length > 0){
			accessibilityOption.style.display = ""
			sendButton.style.display = ""
			sendButton.disabled = false
			if(htmlElem.value == "T"){
				msg.innerHTML = "¿De que tipo es la parada?"
				createOptions("text", ["Marquesina", "Poste"], accessibilityOption)
			}
			if(htmlElem.value == "S"){
				msg.innerHTML = "¿La parada dispone de asientos?"
				createOptions("boolean", 3, accessibilityOption)
			}
			else if(htmlElem.value == "W"){
				msg.innerHTML = "¿La parada dispone de espacio para silla de ruedas?"
				createOptions("boolean", 3, accessibilityOption)
			}
			else if(htmlElem.value == "I"){
				msg.innerHTML = "¿La parada dispone de apoyos lumbares?"
				createOptions("boolean", 3, accessibilityOption)
			}
			else if(htmlElem.value == "P"){
				msg.innerHTML = "¿La parada dispone de pavimento para ciegos?"
				createOptions("boolean", 3, accessibilityOption)
			}
		}
		else{
			accessibilityOption.style.display = "none"
			sendButton.disabled = true
			msg.innerHTML = "";
		}
	}
	else if(htmlElem.id == "accessibility-option" && accessibilityAttribute.value.length > 0){

		var result;
		if(accessibilityOption.value == "true")
			result = true;
		else if(accessibilityOption.value == "false")
			result = false;
		else
			result = undefined;

		if(accessibilityAttribute.value == "T"){
			cs.acc_data.type = accessibilityOption.value
		}
		if(accessibilityAttribute.value == "S"){
			cs.acc_data.seats = result
		}
		else if(accessibilityAttribute.value == "W"){
			cs.acc_data.spaceWheelchair = result
		}
		else if(accessibilityAttribute.value == "I"){
			cs.acc_data.isquialSupports = result
		}
		else if(accessibilityAttribute.value == "P"){
			cs.acc_data.specialPavementBorder = result
		} 
	}

	function createOptions(type, options, selectElem){
		selectElem.innerHTML = ""
		if(type == "boolean")
			for(var i = 0 ; i < options ; i++){
				o = document.createElement('option')
				if(i == 0){
					o.value = ""
					o.text = "Seleccione"
				}
				if(i == 1){
					o.value = true
					o.text = "SI"
				}
				else if(i == 2){
					o.value = false
					o.text = "NO"
				}
				selectElem.add(o)
			}
		else if(type == "text"){
			console.log("createOptions - text")
			if(typeof(options) == "object"){
				options.forEach(function(el, ind){
					o = document.createElement('option')
					o.text = el
					if(el == "Marquesina")
						o.value = "roof"
					else
						o.value = "no-roof"
					selectElem.add(o)
				});
			}
		}
	}
}

UI.prototype.sendData = function(){
	cs.acc_data.update()
	SM.anotate(cs.id, cs.acc_data)
}	
