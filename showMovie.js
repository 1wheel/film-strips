var currentLine = 0;
var svg = d3.select("#chart")
    	.append("svg")
    	.attr("width", 200)
   		.attr("height", 600); 
var botLine = svg.append("line").style("stroke-linecap", "round");
var topLine = svg.append("line").style("stroke-linecap", "round");
var colors;
var lines;
var moviePath;
var movieName;

function updateMovie(name){
	d3.selectAll(".bars").remove();

	moviePath = 'movieStills\\' + name + '\\'
	d3.json(moviePath + 'colors.json', function(data){
		movieName = name;
		colors = data;
	   	lines = svg.selectAll("line")
	   			.data(colors)
	   			.enter()
	   		.append("line")
	   			.attr("x1", 0)
	   			.attr("x2", 100)
	   			.attr("y1", function(d){return d.i;})
	   			.attr("y2", function(d){return d.i;})
	   			.style("stroke", 'grey')
	   			.on("mouseover", function(d){
	   				updateBar(d.i);
	   			})
	   			.attr("id", function(d){return "bar" + d.i;})
	   			.attr("class", "bar");

	   	//download low quality images
		var imageArray = []
		for (var i = 0; i < 600; i++){
			imageArray[i] = new Image();
			imageArray[i].src = moviePath + (i + 1) + '.jpg.t';
			imageArray[i].onload = function(){
				var i = this.src.split(movieName + '/')[1].split(".")[0];
				d3.select("#bar" + i).style("stroke", 'rgb(' + colors[i].rgb + ')');
			}
		}
	});
}
updateMovie("Argo");

function updateBar(i){
	document.getElementById("img").src = moviePath + (i + 1) + '.jpg.t';
	setTimeout(function(){HDimageLoad(i);}, 50);
	currentLine = i;
	botLine
		.attr("x1", 100).attr("y1", i).attr("x2", 200).attr("y2", 500)
		.attr("stroke", 'rgb(' + colors[i].rgb + ')').attr("stroke-width", 4);
	topLine
		.attr("x1", 100).attr("y1", i).attr("x2", 200).attr("y2", 500-400)
		.attr("stroke", 'rgb(' + colors[i].rgb + ')').attr("stroke-width", 4);
}

function HDimageLoad(i){
	if (currentLine == i){
		console.log("HQ Called for " + i);
		var image = new Image();
		image.onload = function(){
			console.log(i);
			if (currentLine == i){
				document.getElementById("img").src = moviePath + (i + 1) + '.jpg';
			}
		}
		image.src = moviePath + (i - 1) + '.jpg';
	}
}

document.onkeydown = function(e) {
	if (e.keyCode == 74){
		updateBar(Math.min(600, currentLine + 1));
	}
	if (e.keyCode == 75){
		updateBar(Math.max(0, currentLine - 1));
	}
}
