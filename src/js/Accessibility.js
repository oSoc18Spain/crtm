function Accessibility(type,spb,seats,is,swc,st,dla){
	
	this.type = type;
	this.state = st;
	this.dateLastAnnot = dla;
	this.specialPavementBorder = spb;
	this.seats = seats;
	this.isquialSupports = is;
	this.spaceWheelchair = swc;

}

Accessibility.prototype.update = function(){
	
	d = new Date();
	
	this.dateLastAnnot = d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();

}

Accessibility.prototype.getindex = function(){
	
	index = 0;
	
	this.specialPavementBorder ? index ++: undefined;
	this.seats ? index ++: undefined;
	this.isquialSupports ? index ++: undefined;
	this.spaceWheelchair ? index ++: undefined;
	
	if(this.dateLastAnnot == undefined){
		
		return undefined;
		
	}else{
	
		return index;
		
	}
	
}
	
