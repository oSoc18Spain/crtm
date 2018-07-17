/*var map;
var geocoder;
var markers;
var bounds;
var walker;*/

var home = {lat: 40.3980136, lng: -3.7282341000000088}; //Atocha
	


function GMaps(){
	
	this.map;
	this.bounds;
	this.geocoder;
	this.markers;
	this.walker;
	
}

GMaps.prototype.init = function(){

	
	this.map = new google.maps.Map(document.getElementById('map'), {
        center: G.position,
        zoom: 12
      });
      
	this.geocoder = new google.maps.Geocoder();

	this.markers = [];
	
	this.walker = {
		url: '/img/walker.png',
		size: new google.maps.Size(24, 24),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 24)
	};
	
}

GMaps.prototype.geocode = function(txt, cb){
	
	this.geocoder.geocode({'address': txt}, cb);
	
}

GMaps.prototype.addstation = function(station){
	
	this.bounds = new google.maps.LatLngBounds();

	for(i = 0; i < station.length; i++){
				
		marker = new google.maps.Marker({
			position: station[i].coord(),
			map: this.map,
			title: station[i].name
		});
		
		marker.addListener('click', function(id){ 
			return function(){
				UX_UI.show_station(id);
			}	
		}(station[i].id));
		
		this.bounds.extend(station[i].coord());

 		this.markers.push(marker);
		
	}
	
	this.map.fitBounds(this.bounds);

}

GMaps.prototype.cleanstation = function(){
	
	this.markers.forEach(function(mk){
		mk.setMap(null);
	});
	
	this.markers = [];
	
}
