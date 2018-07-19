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

GMaps.prototype.init = function(id, center, zoom){

	
	this.map = new google.maps.Map(document.getElementById(id), {
        center: center == undefined ? G.position : center,
        zoom: zoom == undefined ? 12 : zoom
      });
      
	this.geocoder = new google.maps.Geocoder();

	this.markers = [];
	
	this.walker = {mk_ico: {
								url: 'https://osoc18spain.github.io/crtm/src/img/me.png',
								size: new google.maps.Size(18, 18),
								origin: new google.maps.Point(0, 0),
								anchor: new google.maps.Point(0, 18)
							},
	
				   mk: undefined
				   };
	
}

GMaps.prototype.geocode = function(txt, cb){
	
	this.geocoder.geocode({'address': txt, 'bounds': {
		north: 40.43778990262191,
		east: -3.7212908320312636,
		south: 40.219763326896945,
		west: -3.314421325195326}}, cb);
	
}

GMaps.prototype.addstation = function(station){
	
	this.bounds = new google.maps.LatLngBounds();

	for(i = 0; i < station.length; i++){
		
		if(station[i].getindex() < 2){	
			pinColor = "EE1111";	
		}
		
		if(station[i].getindex() >= 2 && station[i].getindex() < 4){	
			pinColor = "EEEE11";	
		}
		
		if(station[i].getindex() >= 4){	
			pinColor = "11EE11";	
		}
		
		if(station[i].getindex() == undefined){	
			pinColor = "666666";	
		}
		
		
		
		
		
		pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
				
		marker = new google.maps.Marker({
			position: station[i].coord(),
			map: this.map,
			icon: pinImage,
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

GMaps.prototype.updateme = function(pos){
	
	if(this.walker.mk == undefined){
		
		this.walker.mk = new google.maps.Marker({
			position: pos,
			map: this.map,
			icon: this.walker.mk_ico,
			title: "Yo"
		});
		
	}else{
		
		this.walker.mk.setPosition(pos);
		
	}
	
}
