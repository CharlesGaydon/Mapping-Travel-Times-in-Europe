console.log("START");
function init() {
	mapFranceDisplay();
}


function mapFranceDisplay(){

    // Canvas
    var width = 600,
    height = 500;


    var alpha = 1.3;

    // Projection
    var svg = d3.select(".mapColumn").append("svg")
      .attr("width", width)
      .attr("height", height);
    var g = svg.append("g");
    var projection = d3.geoConicConformal().center([8, 46.279229]).scale(2500);
    var path = d3.geoPath().projection(projection);

    // Define the div for the tooltip
    var div = d3.select("body")
        .append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0)
        //.style("background", "lightsteelblue");
        // TODO : le css n'est pas utilisé pour div.tooltip. Pourquoi ??

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
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity",0.9)
                    div.html(d.properties.City) //"<br/>"   
                        .style("left", (d3.event.pageX +5) + "px")     
                        .style("top", (d3.event.pageY - 25) + "px");
                })
                .on("mouseout", function(d) {       
                    div.transition()        
                        .duration(100)      
                        .style("opacity", 0);   
                });
        g.selectAll("line")
            .data(cities.features)
            .enter()
            .append("line")
            .attr("x1", function(d) {return projection([d.properties.long, d.properties.lat])[0];})
            .attr("y1", function(d) {return projection([d.properties.long, d.properties.lat])[1];})
            .attr("x2", projection([2,48])[0])
            .attr("y2",  projection([2,48])[1])
            .attr("stroke","grey")
            .attr("stroke-width",1)
            .attr("stroke-dasharray",4);


        g.selectAll("circle")
            .data(cities.features)
            .enter()
            .append("circle")
                .attr("cx", function(d) {return  projection([2,48])[0] + alpha * (projection([2,48])[0] - d.properties.plong) / norme([projection([2,48])[0] - d.properties.plong,projection([2,48])[1] - d.properties.plat]) ;} )
                .attr("cy",  function(d) {return projection([2,48])[1] + alpha * (projection([2,48])[1] - d.properties.plat) / norme([projection([2,48])[0] - d.properties.plong,projection([2,48])[1] - d.properties.plat]) ;} )
                .attr("r", 4)
            .style("fill", "blue");


        });

}

function norme(vecteur){
    var v_norme = Math.sqrt( Math.pow(vecteur[0],2) + Math.pow(vecteur[1],2) );
    return v_norme
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

init();