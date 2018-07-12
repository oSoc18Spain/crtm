var map;
var geocoder;

var home = {lat: 40.3980136, lng: -3.7282341000000088}; //Atocha
	
/*var bus_img = {
	url: 'https://raw.githubusercontent.com/encharm/Font-Awesome-SVG-PNG/master/black/png/32/bus.png',
	size: new google.maps.Size(32, 32),
	origin: new google.maps.Point(0, 0),
	anchor: new google.maps.Point(0, 32)
};*/


function initmap(){
	
	map = new google.maps.Map(document.getElementById('map'), {
        center: this.home,
        zoom: 12
      });
      
	geocoder = new google.maps.Geocoder();
	
}

function searchmap(search, cb){

			geocoder.geocode({'address': search}, cb);
}

function searchmap_cb(results, status){

		MAX_RESULTS = 15

		if(status === 'OK'){
			
			ll = {lat: results[0].geometry.location.lat(), 
				lng: results[0].geometry.location.lng()};

			radius = 100;

			sl = SM.search(ll, radius)

			while((sl = SM.search(ll, radius)).length < MAX_RESULTS)
				radius += 100;
			addstation(sl);

			document.getElementById('results-button').style.display = ""
			console.log(sl)
			sl.forEach(function(elm, idx){
				var result = document.getElementById('result-row')
				var clone = result.cloneNode(true)
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

		}else{
			console.log('Geocode error: ' + status);
		}
		


}

function addstation(marks){
	
	for(i=0; i < marks.length; i++){
		
		console.log(marks[i].coord());
		
		 var marker = new google.maps.Marker({
          position: marks[i].coord(),
          map: map,
          title: marks[i].name
		});
		
	}

}
