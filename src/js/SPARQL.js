function SPARQL(query){

	this.query = query;
	
}


SPARQL.prototype.run = function(cb, ctx){
	
	
	req = $.ajax({
		data: {"query" : this.query, "format" : "json"},
		type: "GET",
		dataType: "json",
		context: ctx,
		url: "http://oasis.summerofcode.oeg-upm.net/sparql",
	});
	
	req.done(cb);
			
}
