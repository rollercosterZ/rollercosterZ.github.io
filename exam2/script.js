var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var canvas = d3.select(".canvas")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var headerGrp = canvas.append("g").attr("class", "headerGrp");
var rowsGrp = canvas.append("g").attr("class","rowsGrp");

var fieldHeight = 30;
var fieldWidth = 90;

var previousSort = null;
var format = d3.time.format("%a %b %d %Y");
//var dateFn = function(date) { return format.parse(d.created_at) };


var jsonData = [
{ "id": 3, "name": "Richy", "male": true, "born": "Sun May 05 2013", "amount": 12000},
{ "id": 1, "name": "Susi", "male": false, "born": "Mon May 13 2013", "amount": 2000},
{ "id": 2, "name": "Patrick", "male": true, "born": "Thu Jun 06 2013", "amount": 17000},
{ "id": 4, "name": "Lorenz", "male": true, "born": "Thu May 09 2013", "amount": 15000},
{ "id": 5, "name": "Christina", "male": false, "born": "Mon Jul 01 2013", "amount": 16000}
];

refreshTable(null);

function refreshTable(sortOn){

	// create the table header	
	var header = headerGrp.selectAll("g")
		.data(d3.keys(jsonData[0]))
	  .enter().append("g")
		.attr("class", "header")
		.attr("transform", function (d, i){
			return "translate(" + i * fieldWidth + ",0)";
		})
		.on("click", function(d){ return refreshTable(d);});
	
	header.append("rect")
		.attr("width", fieldWidth-1)
		.attr("height", fieldHeight);
		
	header.append("text")
		.attr("x", fieldWidth / 2)
		.attr("y", fieldHeight / 2)
		.attr("dy", ".35em")
		.text(String);
	
	// fill the table	
	// select rows
	var rows = rowsGrp.selectAll("g.row").data(jsonData);
	
	// create rows	
	var rowsEnter = rows.enter().append("svg:g")
		.attr("class","row")
		.attr("transform", function (d, i){
			return "translate(0," + (i+1) * (fieldHeight+1) + ")";
		});

	// select cells
	var cells = rows.selectAll("g.cell").data(function(d){return d3.values(d);});
	
	// create cells
	var cellsEnter = cells.enter().append("svg:g")
		.attr("class", "cell")
		.attr("transform", function (d, i){
			return "translate(" + i * fieldWidth + ",0)";
		});
		
	cellsEnter.append("rect")
		.attr("width", fieldWidth-1)
		.attr("height", fieldHeight);	
		
	cellsEnter.append("text")
		.attr("x", fieldWidth / 2)
		.attr("y", fieldHeight / 2)
		.attr("dy", ".35em")
		.text(String);
	
	//update if not in initialisation
	if(sortOn !== null) {
			// update rows
			if(sortOn != previousSort){
				rows.sort(function(a,b){return sort(a[sortOn], b[sortOn]);});			
				previousSort = sortOn;
			}
			else{
				rows.sort(function(a,b){return sort(b[sortOn], a[sortOn]);});
				previousSort = null;
			}
			rows.transition()
				.duration(500)
				.attr("transform", function (d, i){
					return "translate(0," + (i+1) * (fieldHeight+1) + ")";
				});
				
			//update cells
			rows.selectAll("g.cell").select("text").text(String);
	}
}

function sort(a,b){
	if(typeof a == "string"){
		var parseA = format.parse(a);
		if(parseA){
			var timeA = parseA.getTime();
			var timeB = format.parse(b).getTime();
			return timeA > timeB ? 1 : timeA == timeB ? 0 : -1;
		}
		else 
			return a.localeCompare(b);
	}
	else if(typeof a == "number"){
		return a > b ? 1 : a == b ? 0 : -1;
	}
	else if(typeof a == "boolean"){
		return b ? 1 : a ? -1 : 0;
	}
}
