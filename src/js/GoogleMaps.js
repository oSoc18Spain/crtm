var map;
var geocoder;
var markers;
var bounds;

var home = {lat: 40.3980136, lng: -3.7282341000000088}; //Atocha
	
var walker;


function initmap(){
	
	map = new google.maps.Map(document.getElementById('map'), {
        center: G.position,
        zoom: 12
      });
      
	geocoder = new google.maps.Geocoder();

	markers = [];
	
	walker = {
		url: '/img/walker.png',
		size: new google.maps.Size(24, 24),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 24)
	};
	
}

function searchmap(search, cb){
	markers.forEach(function(mk){
		mk.setMap(null);
	});
	markers = []

	r = document.getElementsByClassName("result-row")

	while(r.length > 0){
		r[0].remove();
	}

	geocoder.geocode({'address': search}, cb);
}

function searchmap_cb(results, status){

		MAX_RESULTS = 15

		bounds = new google.maps.LatLngBounds();

		if(status === 'OK'){
			
			ll = {lat: results[0].geometry.location.lat(), 
				lng: results[0].geometry.location.lng()};

			radius = 100;

			sl = SM.search(ll, radius)

			while((sl = SM.search(ll, radius)).length < MAX_RESULTS)
				radius += 100;
			sl = sl.slice(0, MAX_RESULTS);
			addstation(sl);


			document.getElementById('results-button').style.display = ""
			console.log(sl)
			sl.forEach(function(elm, idx){
				var result = document.getElementById('result-row')
				var clone = result.cloneNode(true)
				clone.classList.add('result-row')
				clone.style.display = ""
				clone.id = result.id + idx
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
				result.parentNode.appendChild(clone)
			});

			map.fitBounds(bounds)

		}else{
			console.log('Geocode error: ' + status);
		}
		


}

function addstation(marks){

	for(i = 0; i < marks.length; i++){
		
		// console.log(marks[i].coord());
		
		var marker = new google.maps.Marker({
			position: marks[i].coord(),
			map: map,
			title: marks[i].name
		});

		bounds.extend(marker.getPosition());

		marker.setMap(map);

 		markers.push(marker);
		
	}

}
