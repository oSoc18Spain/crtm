function Station(uri,lat,lng,name,type){
	
	this.uri = uri;
	this.lat = lat;
	this.lng = lng;
	this.name = name;
	this.type = type;
	this.access = new Array();
	this.platforms = new Array();
	
}

Station.prototype.coord = function(){
	
	ll = {
		lat: this.lat,
		lng: this.lng 
	}
	
	return ll;
	
}

Station.prototype.dist = function(ref){
	
	lat1 = ref["lat"];
	lon1 = ref["lng"];
	lat2 = this.lat;
	lon2 = this.lng;

	var R = 6371000;
	var g1 = deg2rad(lat1);
	var g2 = deg2rad(lat2);
	var d1 = deg2rad(lat2-lat1);
	var d2 = deg2rad(lon2-lon1);
	
	var a = Math.sin(d1/2) * Math.sin(d1/2) + Math.cos(g1) * Math.cos(g2) * Math.sin(d2/2) * Math.sin(d2/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return Math.round(R * c * 100)/100; 
	
}

Station.prototype.addplatform = function(uri,line,direction){
	
	platform = {
		uri: uri,
		line: line,
		direction: direction
	}
		
	this.platforms.push(platform);
	
}

Station.prototype.addaccess = function(uri,lat,lng,name){
	
	access = {
		uri: uri,
		lat: lat,
		lng: lng,
		name: name
	}
		
	this.access.push(access);
	
}
