console.log("START");
function init() {
	mapFranceDisplay();
}


function mapFranceDisplay(){
    var width = 600,
    height = 500;

    var svg = d3.select(".mapColumn").append("svg")
      .attr("width", width)
      .attr("height", height);
    
    var g = svg.append("g");

    var projection = d3.geoConicConformal().center([8, 46.279229]).scale(2500);

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
    d3.json("data/French_cities.geojson", function(cities) {
        //console.log(cities.features)
        console.log("projecting French cities")
        cities.features.forEach(function(d){
            var projected_city = projection([d.properties.long, d.properties.lat])
            
            d.properties.plong = projected_city[0]
            d.properties.plat = projected_city[1]                
        }) 
        var cities_objects = svg.append("g")
            .attr("class", "cities")
            .selectAll('circle')
            .data(cities.features)
            .enter()
            .append('circle')
            .attr("cx", function(d) {return d.properties.plong;})
            .attr("cy", function(d) { return d.properties.plat;})
            .attr("r", 7)
            .style("fill", "orange")
        cities_objects.append("title")
            .text(function(d){return d.properties.City})
            .attr("font-size",100)
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

    var projection = d3.geoConicConformal().center([29, 53]).scale(950);

    var path = d3.geoPath() // d3.geo.path avec d3 version 3
                 .projection(projection);
    
    d3.json("data/world.json", function(json) {
      console.log(json)
      g.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "#ccc")
        .style("stroke","#fff");
    });

}

function citiesFranceDisplay(projection){
  var svg = d3.select("g")
  console.log(svg)

}
init();