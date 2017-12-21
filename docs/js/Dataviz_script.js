console.log("START");
var My_reference = undefined

function init() {
	mapFranceDisplay();
    UpdateCitiesFrance();


    // EXEMPLE D'AJOUT DE VILLE
    var villeName = document.getElementById("villeName");
    villeName.textContent="Texte";
    console.log("villeName");
    console.log(villeName);
}


function mapFranceDisplay(){

    // Canvas
    var width = 600,
    height = 500;

    var alpha = 75;
    var paris = [2,48];

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

    // BACKGROUND OF THE MAP
    d3.json("data/france.json", function(json) {
        console.log(json)
        g.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", "#7BCDC2");
    });

    d3.json("data/French_cities.geojson", function(cities) {
        //console.log(cities.features)
        console.log("projecting French cities")
        cities.features.forEach(function(d){
            var projected_city = projection([d.properties.long, d.properties.lat])
            d.properties.plong = projected_city[0]
            d.properties.plat = projected_city[1]                
        }) 
        // associer à chaque ville un dictionniare avec pour chaque autre ville ses voisins.
        // Tous les import de données initiaux se font ici.
        var cities_objects = svg.append("g")
        .attr("class", "cities")
        .selectAll('circle')
        .data(cities.features)
        .enter()
        .append('circle')
            .attr("cx", function(d) {return d.properties.plong;})
            .attr("cy", function(d) { return d.properties.plat;})
            .attr("r", 5.5)
            .style("fill", "blue")
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
            })
            .on("click",function(d){
                if(typeof My_reference !== 'undefined'){
                    if(My_reference.City !=d.properties.City){
                        My_reference = {City :d.properties.City, plong : d.properties.plong, plat : d.properties.plat};
                        console.log(My_reference)
                    }else{
                        My_reference = undefined;
                    }
                }else{
                    My_reference = {City :d.properties.City, plong : d.properties.plong, plat : d.properties.plat};
                }
                    console.log("Ref :"+ My_reference)
                UpdateCitiesFrance();
            });
            
    g.selectAll("line")
        .data(cities.features)
        .enter()
        .append("line")
            .attr("x1", function(d) {return d.properties.plong;})
            .attr("y1", function(d) {return d.properties.plat;})
            .attr("x2", projection([2,48])[0])
            .attr("y2",  projection([2,48])[1])
            .attr("stroke","grey")
            .attr("stroke-width",1)
            .attr("stroke-dasharray",4)
            .attr("opacity", function(d){
                if(My_reference){
                    return(1)
                }else{
                    return(0)
                }
            });


        
        // g.selectAll("circle")
        //     .data(cities.features)
        //     .enter()
        //     .append("circle")
        //         .attr("cx", function(d) {return new_coord(alpha, [projection(paris)[0],projection(paris)[1]], [d.properties.plong,d.properties.plat])[0];} )
        //         .attr("cy", function(d) {return new_coord(alpha, [projection(paris)[0],projection(paris)[1]], [d.properties.plong,d.properties.plat])[1];} )
        //         .attr("r", 5.5)
        //         .style("fill", "#7171D7");
        })
}

function UpdateCitiesFrance(){
    // My_reference = {City: "Grenoble", plong: 257.1682882326301, plat: 165.49279245973003}
    g = d3.select("g")

if (typeof My_reference=='undefined'){
    g.selectAll("line")
        .attr("opacity",0)
}else{
    g.selectAll("line")
        .attr("x1", function(d) {console.log(d.properties.plong);return d.properties.plong;})
        .attr("y1", function(d) {return d.properties.plat;})
        .attr("x2", My_reference.plong)
        .attr("y2",  My_reference.plat)
        .attr("stroke","grey")
        .attr("stroke-width",1)
        .attr("stroke-dasharray",4)
        .attr("opacity", 1)
    }

};    


function norme(vecteur){
    var v_norme = Math.sqrt( Math.pow(vecteur[0],2) + Math.pow(vecteur[1],2) );
    return v_norme;
}
    
function new_coord(v_alpha, vecteur_1, vecteur_2){
  var norme_diff = norme([vecteur_2[0] - vecteur_1[0], vecteur_2[1] - vecteur_1[1]]);
  var x = vecteur_1[0] + v_alpha * (vecteur_2[0] - vecteur_1[0]) * Math.pow(norme_diff,-1);
  var y =  vecteur_1[1] + v_alpha * (vecteur_2[1] - vecteur_1[1]) * Math.pow(norme_diff,-1);
  return [x,y];
}


var paris = [2,48];




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