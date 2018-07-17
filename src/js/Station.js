function Station(id,code,lat,lng,name,type){
	
	this.id = id;
	this.code = code;
	this.lat = lat;
	this.lng = lng;
	this.name = name;
	this.type = type;
	this.acc_obj;
	this.access = new Array();
	this.halls = new Array();
	this.platforms = new Array();
	
}

Station.prototype.addacc = function(acc_obj){
	
	this.acc_obj = acc_obj;
	
}

Station.prototype.coord = function(){
	
	ll = {
		lat: parseFloat(this.lat),
		lng: parseFloat(this.lng)
	}
	
	return ll;
	
}
Station.prototype.deg2rad = function(deg){
	
  return deg * (Math.PI/180);
  
}

Station.prototype.dist = function(ref){
	
	lat1 = ref["lat"];
	lon1 = ref["lng"];
	lat2 = this.lat;
	lon2 = this.lng;

	var R = 6371000;
	var g1 = this.deg2rad(lat1);
	var g2 = this.deg2rad(lat2);
	var d1 = this.deg2rad(lat2-lat1);
	var d2 = this.deg2rad(lon2-lon1);
	
	var a = Math.sin(d1/2) * Math.sin(d1/2) + Math.cos(g1) * Math.cos(g2) * Math.sin(d2/2) * Math.sin(d2/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return Math.round(R * c * 100)/100; 
	
}

Station.prototype.addplatform = function(uri,line,direction,acc_obj){
	
	platform = {
		acc_obj: acc_obj,
		id: id,
		line: line,
		direction: direction
	}
		
	this.platforms.push(platform);
	
}

Station.prototype.addhalls = function(uri,lat,lng,name,acc_obj){
	
	hall = {
		acc_obj: acc_obj,
		id: id,
		lat: lat,
		lng: lng,
		name: name
	}
		
	this.halls.push(hall);
	
}

Station.prototype.addaccess = function(uri,lat,lng,name,acc_obj){
	
	access = {
		acc_obj: acc_obj,
		id: id,
		lat: lat,
		lng: lng,
		name: name
	}
		
	this.access.push(access);
	
}
