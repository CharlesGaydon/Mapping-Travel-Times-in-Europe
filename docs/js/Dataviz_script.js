console.log("START");
var My_reference = undefined
var alpha = 0.0089;
dynamic_color = "green";
static_color = "#7171D7";
main_color = "#ED0109";
radius_main = 6.5;
radius_dynamic = 5.5; 
radius_static = 4;
France_color = "#97F2F2"; //before : "#7BCDC2"


function init() {
    mapFranceDisplay();
    UpdateCitiesFrance();
}


function mapFranceDisplay(){

    // Canvas
    var width = 600,
    height = 500;

    //var paris = [2,48];

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
        g.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", France_color);
    });

    d3.csv("data/French-cities_lat_long.csv", function(cities) {
        console.log("projecting French cities")
        cities.forEach(function(d){
            d.long = parseFloat(d.long)
            d.lat = parseFloat(d.lat)
            var projected_city = projection([d.long, d.lat])
            d.plong = projected_city[0]
            d.plat = projected_city[1] 
            d.dist = -1               
        }) 
        // associer à chaque ville un dictionniare avec pour chaque autre ville ses voisins.

        d3.csv("data/French-cities_Distance_Matrix.txt",function(distances){
            for(var city_index = 0 ; city_index<distances.length;city_index++){
                var the_city = cities[city_index]["City"]
                for(var dist_index = 0 ; dist_index<distances.length;dist_index++){
                    if(distances[dist_index][""] == the_city){
                        delete distances[dist_index][""]
                        for(var key in distances[dist_index]){
                           distances[dist_index][key] = parseFloat(distances[dist_index][key])
                           if(isNaN(distances[dist_index][key])){
                            distances[dist_index][key] = 10000
                           }
                        }
                        cities[city_index]["dist"] = distances[dist_index]
                        break
                    }
                }
            }
        })
        console.log(cities)
        console.log(Object.keys(cities[0]))
        // Tous les import de données initiaux se font ici.
        var g = d3.select("g")

     // STATIC CITIES
        g.selectAll('.Static_Cities')
                .data(cities)
                .enter()
                .append('circle')
                    .attr("class","Static_Cities")
                    .attr("cx", function(d) {return d.plong;})
                    .attr("cy", function(d) { return d.plat;})
                    //.attr("r", 3.5) //pas de rayon initialement !
                    .style("fill", static_color)
                    .style("opacity",0.8)
                    .on("click",function(d){
                        if(typeof My_reference !== 'undefined'){
                            if(My_reference.City !=d.City){
                                My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                                console.log(My_reference)
                            }else{
                                My_reference = undefined;
                            }
                        }else{
                            My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                            console.log("Ref :"+ My_reference.City)
                        }
                        UpdateCitiesFrance();
                    });
        // DYNAMIC CITIES
        g.selectAll('.Cities')
            .data(cities)
            .enter()
            .append('circle')
                .attr("class","Cities")
                .attr("cx", function(d) {return d.plong;})
                .attr("cy", function(d) { return d.plat;})
                .attr("r", radius_dynamic)
                .style("fill", dynamic_color)
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity",0.9)
                    div.html(d.City) //"<br/>"   
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
                        if(My_reference.City !=d.City){
                            My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                            console.log(My_reference)
                        }else{
                            My_reference = undefined;
                        }
                    }else{
                        My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                        console.log("Ref :"+ My_reference.City)
                    }
                    UpdateCitiesFrance();
                });
    
    // INITIALIZE TRANSPARENT LINES
    g.selectAll("line")
        .data(cities)
        .enter()
        .append("line")
            .attr("x1", function(d) {return d.plong;})
            .attr("y1", function(d) {return d.plat;})
            .attr("x2", projection([2,48])[0])
            .attr("y2",  projection([2,48])[1])
            .attr("stroke","grey")
            .attr("stroke-width",1)
            .attr("stroke-dasharray",4)
            .attr("opacity", 0)        
        })
}

function UpdateCitiesFrance(){
    // My_reference = {City: "Grenoble", plong: 257.1682882326301, plat: 165.49279245973003}
    g = d3.select("g")

    // DYNAMIC LINKS
    if (typeof My_reference=='undefined'){
        g.selectAll("line")
            .attr("opacity",0)
        // REBOUGER DANS L'AUTRE SENS LES VILLES ICI !
        g.selectAll(".Cities")
            .transition().duration(300)
            .attr("cx", function(d) {return d.plong;} )
            .attr("cy", function(d) {return d.plat;} )
            .attr("r", radius_static)
            .style("fill", dynamic_color);

        g.selectAll(".Static_Cities")
            .transition().duration(300)
            .attr("r", 0)
    
    }else{

        // DYNAMIC CITIES
        g.selectAll(".Cities").filter(function(d){return My_reference.City != d.City })
            .transition().duration(300)
            .attr("cx", function(d) {return new_coord(alpha*d["dist"][My_reference.City], [My_reference.plong,My_reference.plat], [d.plong,d.plat])[0];} )
            .attr("cy", function(d) {return new_coord(alpha*d["dist"][My_reference.City], [My_reference.plong,My_reference.plat], [d.plong,d.plat])[1];} )
            .attr("r", radius_dynamic)
            .style("fill", dynamic_color);

        g.selectAll(".Cities")
            .filter(function(d){return My_reference.City == d.City;})
            .transition().duration(300)
            .attr("cx", function(d){console.log("here",d.City); return d.plong;})
            .attr("cy", function(d){return d.plat;})
            .attr("r",radius_main)
            .style("fill",main_color)

        g.selectAll(".Static_Cities")
            .transition().duration(300)
            .attr("r", radius_static)
            .style("fill", static_color);

        g.selectAll("line")
            .attr("x1", function(d) {return d.plong;})
            .attr("y1", function(d) {return d.plat;})
            .attr("x2", My_reference.plong)
            .attr("y2",  My_reference.plat)
            .attr("stroke","grey")
            .attr("stroke-width",0)
            .attr("stroke-dasharray",4)
            .attr("opacity", 0)
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
