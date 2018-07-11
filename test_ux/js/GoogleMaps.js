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

		if(status === 'OK'){
			
			ll = {lat: results[0].geometry.location.lat(), 
				lng: results[0].geometry.location.lng()};

			sl = SM.search(ll,1000);
			
			console.log(ll.toString());
			
			console.log(sl);
			
			addstation(sl);
			

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
