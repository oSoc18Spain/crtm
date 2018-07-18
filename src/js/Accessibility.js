function Accessibility(type,spb,seats,is,swc,st,dla){
	
	this.type = type;
	this.state = st;
	this.dateLastAnnot = dla;
	
	spb ? this.specialPavementBorder = true: this.specialPavementBorder = false;
	seats ? this.seats = true : this.seats = false;
	is ? this.isquialSupports = true: this.isquialSupports = false;
	swc ? this.spaceWheelchair = true : this.spaceWheelchair = false;

}

Accessibility.prototype.update = function(){
	
	d = new Date();
	
	this.dateLastAnnot = d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();

}
