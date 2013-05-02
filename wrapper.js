d3.json('movies.json', function(movieArray){
	d3.select("#selectNumber")
				.on("change", function(){
					updateMovie(this.options[this.selectedIndex].value);})
			.selectAll("option").data(movieArray).enter().append("option")
				.text(function(d){return d.replace(/_/g, " ")})
				.attr("value", function(d){return d});
});