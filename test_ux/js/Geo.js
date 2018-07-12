function Geo(){
	
	this.watchID;
	this.position = {lat: 40.3980136, lng: -3.7282341000000088};
	
}

Geo.prototype.isgeo = function(){
	
	return ("geolocation" in navigator);
	
}

Geo.prototype.follow = function(){
	
	this.watchID = navigator.geolocation.watchPosition((this.update).bind(this), this.update_error);
	
}

Geo.prototype.unfollow = function(){
	
	navigator.geolocation.clearWatch(this.watchID);
	
}

Geo.prototype.update = function(pos){
	
	this.position = pos;
	
}

Geo.prototype.update_error = function(e){
	
	console.log(e);
	
}

Geo.prototype.coord = function(){
	
	
	pos = {
		lat: this.position.coords.latitude,
		lng: this.position.coords.longitude
	};
	
	return pos;
	
}

