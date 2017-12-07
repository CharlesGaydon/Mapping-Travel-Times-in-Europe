console.log("START");
function init() {
	console.log("init");
	console.log(document.getElementById("test"));
	document.getElementById("test").innerHTML = "Paragraph add with JS";
	mapFranceDisplay();
}


function mapFranceDisplay(){
	var width = 700,
  	height = 580;

	var svg = d3.select( "body" )
		.append( "svg" )
	  .attr( "width", width )
	  .attr( "height", height );
    
    var g = svg.append("g");

    var projection = d3.geoConicConformal().center([2.454071, 46.279229]).scale(2850);

    var path = d3.geoPath() // d3.geo.path avec d3 version 3
                 .projection(projection);
    
          d3.json("data/france.json", function(json) {
        
            g.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("fill", "#ccc");

        });

}
init();