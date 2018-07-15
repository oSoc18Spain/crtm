function Geo(){
	
	this.watchID;
	this.position = {lat: 40.3980136, lng: -3.7282341000000088};
	
	if(!("geolocation" in navigator)){
		
		this.status = 0;
		
	}
	
}


Geo.prototype.follow = function(){
	
	this.status = 1;
	this.watchID = navigator.geolocation.watchPosition((this.update).bind(this), this.update_error);
	
}

Geo.prototype.unfollow = function(){
	
	this.status = 10;
	navigator.geolocation.clearWatch(this.watchID);
	
}

Geo.prototype.update = function(pos){
	
	this.status = 2;

	this.position = {
		lat: pos.coords.latitude,
		lng: pos.coords.longitude
	};
	
}

Geo.prototype.update_error = function(e){
	
	this.status = 9;
	console.log(e);
	
}

