function SPARQL(query){

	this.query = query;
	
}


SPARQL.prototype.run = function(cb, ctx){
	
	
	req = $.ajax({
		data: {"query" : this.query, "format" : "json"},
		type: "POST",
		dataType: "json",
		context: ctx,
		url: "http://oasis.summerofcode.oeg-upm.net/virtuoso/sparql",
	});
	
	req.done(cb);
			
}

SPARQL.prototype.build_in = function(list){
	
	in_ret = "";
	
	for(i = 0; i < list.length; i++){
		
		if(i == (list.length-1)){
			
			in_ret = in_ret + "'"+list[i].id+"')";
			
		}
		
		if(i == 0){
			
			in_ret = "('"+list[i].id+"',";
			
		}
		
		if(i != 0 && i != (list.length-1)){
			
			in_ret = "'"+list[i].id+"'";
			
		}
		
	}
			
}
