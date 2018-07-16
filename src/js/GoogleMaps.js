var map;
var geocoder;
var markers;

var home = {lat: 40.3980136, lng: -3.7282341000000088}; //Atocha
	
var walker;

function GMaps(){
	
	this.map;
	this.geocoder;
	this.markers;
	this.walker;
	
}

GMaps.prototype.init = function(){

	
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

GMaps.prototype.search = function(search,cb){

	this.markers.forEach(function(mk){
		mk.setMap(null);
	});
	this.markers = []

	/*r = document.getElementsByClassName("result-row")

	while(r.length > 0){
		r[0].remove();
	}*/

	this.geocoder.geocode({'address': search}, cb);
}

GMaps.prototype.searchmap_cb = function(results, status){

		

		if(status === 'OK'){
			
			

		}else{
			console.log('Geocode error: ' + status);
		}
		


}

GMaps.prototype.addstation = function(marks){

	for(i = 0; i < marks.length; i++){
		
		console.log(marks[i].coord());
		
		var marker = new google.maps.Marker({
			position: marks[i].coord(),
			map: this.map,
			title: marks[i].name
		});

		marker.setMap(map);

 		this.markers.push(marker);
		
	}

}
