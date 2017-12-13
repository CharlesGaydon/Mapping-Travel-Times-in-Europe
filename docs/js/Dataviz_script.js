console.log("START");
function init() {
	mapEuropeDisplay();
}


function mapFranceDisplay(){
  var width = 700,
    height = 580;

  var svg = d3.select("body").append("svg")
      .attr("width", 960)
      .attr("height", 500);
    
    var g = svg.append("g");

    var projection = d3.geoConicConformal().center([2.454071, 46.279229]).scale(2000);

    var path = d3.geoPath() // d3.geo.path avec d3 version 3
                 .projection(projection);
    
          d3.json("data/france.json", function(json) {
            console.log(json)
            g.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("fill", "#ccc");

        });

}
function mapEuropeDisplay(){
	var width = 700,
  	height = 580;

	var svg = d3.select( ".mapColumn" )
		.append( "svg" )
	  .attr( "width", width )
	  .attr( "height", height );
    
    var g = svg.append("g");

    var projection = d3.geoConicConformal().center([2.454071, 46.279229]).scale(2000);

    var path = d3.geoPath() // d3.geo.path avec d3 version 3
                 .projection(projection);
    
          d3.json("data/europe.json", function(json) {
            console.log(json)
            g.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("fill", "#ccc");

        });

}
init();