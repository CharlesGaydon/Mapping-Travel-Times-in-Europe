console.log("START");

France_color = "#97F2F2"; //before : "#7BCDC2"
dynamic_color = "#F48B01";
static_color = "#7171D7";
main_color = "#ED0109";

var My_reference = undefined
var My_destination = undefined
// var mouse_position = undefined;
Europe_slider_range = [0.0005,0.002,0.0008]; //min max init
France_slider_range = [0.0015,0.018,0.010];
slider_range = {"Europe":Europe_slider_range,"France":France_slider_range}
var an_hour = undefined;
var Paris = [48.856614,2.35];
// select_text = "-------------------- Select a reference city !  ----------------";
// play_text = "-------------------- Now play with me !  --------------------";
select_text = "";
play_text = "";

radius_main = 6.5;
radius_dynamic = 4.5; 
radius_static = 5.5;
radius_offset = 1.8;

move_time = 500

function init() {
    mouseListener();
    // mapEuropeDisplay();
    //mapFranceDisplay();
    //UpdateCitiesFrance();
}

function changeToEurope(){
    console.log("europe");
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup").style.visibility = "hidden";
    document.getElementById("boxplot").style.visibility = "visible";
    document.getElementById("scale").style.visibility = "visible";
    document.getElementById("drawMap").innerHTML = "";
    mapEuropeDisplay();
}

function changeToFrance(){
    console.log("france");
    document.getElementById("popup").style.display = "none"; 
    document.getElementById("popup").style.visibility = "hidden";
    document.getElementById("boxplot").style.visibility = "visible";
    document.getElementById("scale").style.visibility = "visible";
    document.getElementById("drawMap").innerHTML = "";
    mapFranceDisplay();
}


function mapFranceDisplay(Which_map = "France"){

    // Canvas
    var width = 600,
    height = 500;


    // Projection
    var svg = d3.select(".mapColumn").append("svg")
      .attr("width", width)
      .attr("height", height);
    var g = svg.append("g");
    var projection = d3.geoConicConformal().center([8, 46.279229]).scale(2900);
    var path = d3.geoPath().projection(projection);

    // Define the div for the tooltip
    // var div = d3.select("body")
    //     .append("div")   
    //     .attr("class", "tooltip")               
    //     .style("opacity", 1)
    //     .attr("html","test")
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

    // ADD SLIDER FOR ALPHA VALUE 
    var slider = document.getElementById("slider");

    slider.min = slider_range[Which_map][0];
    slider.max = slider_range[Which_map][1];
    slider.step = (slider.max-slider.min)/25
    slider.value = slider_range[Which_map][2]
    alpha = slider.value //ICI VALEUR INITIALE ALPHA
    var output = document.getElementById("alpha_span");
    output.innerHTML = select_text; //not used
    slider.oninput = function() {
      alpha = this.value
      UpdateCitiesFrance();
    } 
    // output.fill = "blue";
    // slider.fill = "#006EE3"
    // d3.select("#alpha_span").attr("fill","blue").attr("transform", "translate(0,-30)")
    // d3.select("#slider").attr("fill","#006EE3")

    d3.csv("data/French-Cities_lat_long.csv", function(cities) {
        console.log("projecting French cities")
        cities.forEach(function(d){
            d.long = parseFloat(d.long)
            d.lat = parseFloat(d.lat)
            var projected_city = projection([d.long, d.lat])
            d.plong = projected_city[0]
            d.plat = projected_city[1] 
            d.dist = -1     
            if(d.City=="Paris"){
                Paris = {}
                Paris.plat = d.plat;
                Paris.plong = d.plong;
            }          
        }) 
        // associer à chaque ville un dictionniare avec pour chaque autre ville ses voisins.

        d3.csv("data/French-Cities_Distance_Matrix.txt",function(distances){
            for(var city_index = 0 ; city_index<distances.length;city_index++){
                var the_city = cities[city_index]["City"]
                for(var dist_index = 0 ; dist_index<distances.length;dist_index++){
                    if(distances[dist_index][""] == the_city){
                        delete distances[dist_index][""]
                        for(var key in distances[dist_index]){
                           distances[dist_index][key] = parseFloat(distances[dist_index][key])
                           if(isNaN(distances[dist_index][key])){
                            distances[dist_index][key] = undefined
                           }
                        }
                        cities[city_index]["dist"] = distances[dist_index]
                        break
                    }
                }
            }
        })
        console.log(JSON.stringify(cities[0]["dist"]))
        console.log(cities)
        console.log(Object.keys(cities[0]))
        // Tous les import de données initiaux se font ici.
        var g = d3.select("g")

    // APPEND ISOCHRONES CIRCLES

    an_hour = 3600 * alpha

    console.log("An hour is worth (px) :")
    console.log(an_hour)
    
    var isoH  = []
    d3.range(12).forEach(function(d){
        isoH.push({"NB_hour":d+1,"label": String(d+1) + "h", "r" : (d+1)*an_hour})
    })
    isoH = isoH.reverse()

    g.selectAll(".iso_circles")
      .data(isoH)
      .enter()
      .append("circle")
        .attr("class","iso_circles")
        .attr("r",function(d){
            return d.r;
        })
        .attr("cx",projection([48.856614,2.35])[0])
        .attr("cy",projection([48.856614,2.35])[1])
        .attr("opacity",0)
        .on("mousemove", function(d){
            d3.select("#iso_label"+d.NB_hour)
            .attr("x",mouse_position[0]-8)
            .attr("y",mouse_position[1]-115)
            .attr("opacity",1)
        })
        .on("mouseout", function(d){
            d3.select("#iso_label"+d.NB_hour).attr("opacity",0)
        })


    g.selectAll(".iso_label")
          .data(isoH)
          .enter()
          .append("text")
              .attr("class", "iso_label user-select-none")
              .attr("id",function(d){return "iso_label"+d.NB_hour;})
              .attr("x", projection([48.856614,2.35])[0])
              .attr("y", function(d) {var y = projection([48.856614,2.35])[1]; return y; }) //faux mais osef
              .attr("font-size", "13px")
              .attr("font-weight","bold")
              .attr("opacity",0)
              .text(function(d) {return d.label;});

    
    // INITIALIZE TRANSPARENT LINES
    g.selectAll("line")
        .data(cities)
        .enter()
        .append("line")
            .attr("class","dir_line")
            .attr("x1", function(d) {return d.plong;})
            .attr("y1", function(d) {return d.plat;})
            .attr("x2", projection([2.35,48.856614])[0])
            .attr("y2",  projection([2.35,48.856614])[1])
            .attr("opacity",0)

     // STATIC CITIES
        g.selectAll('.Static_Cities')
                .data(cities)
                .enter()
                .append('circle')
                    .attr("class","Static_Cities")
                    .attr("id", function(d){return "static_"+d.City;})
                    .attr("cx", function(d) {return d.plong;})
                    .attr("cy", function(d) { return d.plat;})
                    .attr("position","absolute")
                    .attr("z-index", 4)
                    .attr("r", 0.0001)
                    .style("fill", static_color)
                    .style("opacity",0.8)
                    .on("click",function(d){
                        document.getElementById("travel").style.visibility = "hidden";
                        document.getElementById("destination").style.visibility = "hidden";
                        My_destination = undefined;
                        if(typeof My_reference !== 'undefined'){
                            if(My_reference.City !=d.City){
                                document.getElementById("travel").style.visibility = "visible";
                                My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                                changeInformationCityOrigin(My_reference.City, My_reference.City + ".jpg");
                            }else{
                                My_reference = undefined;
                                changeInformationCityOrigin("Select city", My_reference + ".jpg");
                            }
                        }else{
                            document.getElementById("travel").style.visibility = "visible";
                            My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                            changeInformationCityOrigin(My_reference.City, My_reference.City + ".jpg");
                            if(typeof My_destination !== 'undefined'){
                                document.getElementById("destination").style.visibility = "visible";
                                getTimeBetweenTwoCities(My_reference, My_destination, cities);
                            }
                            console.log("Ref :"+ My_reference.City)
                        }
                        UpdateCitiesFrance();
                    })
                .on("mouseover",function(d){
                    document.getElementById("travel").style.visibility = "hidden";
                    document.getElementById("destination").style.visibility = "hidden";
                    d3.select(this).style("cursor", "pointer")
                    d3.select(this).style("r", radius_static+radius_offset); 
                    d3.select("#dynamic_"+d.City).style("r", radius_dynamic+radius_offset); 

                    if(typeof My_reference !== 'undefined'){
                        document.getElementById("travel").style.visibility = "visible";
                        if(My_reference.City !=d.City){
                            My_destination = {City :d.City, plong : d.plong, plat : d.plat};
                            changeInformationCityDestination(d.City, d.City + ".jpg");
                            document.getElementById("destination").style.visibility = "visible";
                            getTimeBetweenTwoCities(My_reference, My_destination, cities);
                            //changeInformationTravel("ca change");
                        }else{
                            My_destination = undefined;
                            //changeInformationCityDestination("Hover city", "undefined.jpg");
                            changeInformationTravel("Hover city");
                        }
                    }else{
                        document.getElementById("travel").style.visibility = "visible";
                        My_destination = {City :d.City, plong : d.plong, plat : d.plat};
                        changeInformationCityDestination(d.City, d.City + ".jpg");
                        changeInformationTravel("Hover city");
                    }
                    UpdateCitiesFrance();
                })
                .on("mouseout",function(d){
                    d3.select(this).style("cursor", "default")
                    d3.select(this).transition().duration(50).style("r", radius_static);
                    d3.select("#dynamic_").transition().duration(50).style("r", radius_dynamic); 
                });
        // DYNAMIC CITIES
        g.selectAll('.Cities')
            .data(cities)
            .enter()
            .append('circle')
                .attr("class","Cities")
                .attr("id", function(d){return "dynamic_"+d.City;})
                .attr("cx", function(d) {return d.plong;})
                .attr("cy", function(d) { return d.plat;})
                .attr("r", radius_dynamic)
                .style("fill", dynamic_color)
                .attr("position","absolute")
                .attr("z-index", 4)
                .on("click",function(d){
                    document.getElementById("travel").style.visibility = "hidden";
                    document.getElementById("destination").style.visibility = "hidden";
                    My_destination = undefined;
                    if(typeof My_reference !== 'undefined'){
                        if(My_reference.City !=d.City){
                            document.getElementById("travel").style.visibility = "visible";
                            My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                            changeInformationCityOrigin(My_reference.City, My_reference.City + ".jpg");
                        }else{
                            My_reference = undefined;
                            changeInformationCityOrigin("Select city", My_reference + ".jpg");
                            changeInformationTravel("Hover city");
                        }
                    }else{
                        document.getElementById("travel").style.visibility = "visible";
                        My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                        changeInformationCityOrigin(My_reference.City, My_reference.City + ".jpg");
                        if(typeof My_destination !== 'undefined'){
                            document.getElementById("destination").style.visibility = "visible";
                            getTimeBetweenTwoCities(My_reference, My_destination, cities);
                        }
                        console.log("Ref :"+ My_reference.City)
                    }
                    UpdateCitiesFrance();
                })
                .on("mouseover",function(d){
                    document.getElementById("travel").style.visibility = "hidden";
                    document.getElementById("destination").style.visibility = "hidden";
                    d3.select(this).style("cursor", "pointer")
                    d3.select(this).style("r", radius_dynamic+radius_offset);
                    d3.select("#static_"+d.City).style("r", radius_static+radius_offset);
                    
                    if(typeof My_reference !== 'undefined'){
                        document.getElementById("travel").style.visibility = "visible";
                        if(My_reference.City !=d.City){
                            My_destination = {City :d.City, plong : d.plong, plat : d.plat};
                            changeInformationCityDestination(d.City, d.City + ".jpg");
                            document.getElementById("destination").style.visibility = "visible";
                            getTimeBetweenTwoCities(My_reference, My_destination, cities);
                            
                        }else{
                            My_destination = undefined;
                            //changeInformationCityDestination("Hover city", "undefined.jpg");
                            changeInformationTravel("Hover city");
                        }
                    }else{
                        My_destination = {City :d.City, plong : d.plong, plat : d.plat};
                        changeInformationCityDestination(d.City, d.City + ".jpg");
                        changeInformationTravel("Hover city");
                    }
                    UpdateCitiesFrance();
                })
                .on("mouseout",function(d){
                    d3.select(this).style("cursor", "default")
                    d3.select(this).transition().duration(50).style("r", radius_dynamic);
                    d3.select("#static_"+d.City).transition().duration(50).style("r", radius_static);
                });

    // APPEND TOOLTIP

    g.selectAll(".city_label")
      .data(cities)
      .enter()
      .append("text")
          .attr("class", "city_label user-select-none")
          .attr("id", function(d){return d.City;})
          .text(function(d) { return d.City.toUpperCase();}) //test de majuscule
          .attr("x", function(d) { return d.plong-10; })
          .attr("y", function(d) { return d.plat +15; })
          .attr("font-size", "11px")// .attr("font-weight","bold")
          .on("click", function(d){
                if(typeof My_reference !== 'undefined'){
                        if(My_reference.City !=d.City){
                            My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                            changeInformationCityOrigin(My_reference.City, My_reference.City + ".jpg");
                            if(typeof My_destination !== 'undefined')
                                getTimeBetweenTwoCities(My_reference, My_destination, cities);
                            console.log(My_reference)
                        }else{
                            My_reference = undefined;
                            changeInformationCityOrigin("Select city", My_reference + ".jpg");
                            changeInformationTravel("Select cities");
                        }
                    }else{
                        My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                        changeInformationCityOrigin(My_reference.City, My_reference.City + ".jpg");
                        if(typeof My_destination !== 'undefined')
                            getTimeBetweenTwoCities(My_reference, My_destination, cities);
                        console.log("Ref :"+ My_reference.City)
                    }
                    UpdateCitiesFrance();
          })
          .on("mouseover",function(d){
                    d3.select(this).style("cursor", "pointer")
                    d3.select('#dynamic_'+d.City).style("r", radius_dynamic+radius_offset);
                    d3.select('#static_'+d.City).style("r", radius_static+radius_offset);
                    if(typeof My_reference !== 'undefined'){
                        if(My_reference.City !=d.City){
                            My_destination = {City :d.City, plong : d.plong, plat : d.plat};
                            changeInformationCityDestination(d.City, d.City + ".jpg");
                            getTimeBetweenTwoCities(My_reference, My_destination, cities);
                            
                        }else{
                            My_destination = undefined;
                            changeInformationCityDestination("Hover city", "undefined.jpg");
                            changeInformationTravel("Select cities");
                        }
                    }else{
                        My_destination = {City :d.City, plong : d.plong, plat : d.plat};
                        changeInformationCityDestination(d.City, d.City + ".jpg");
                        changeInformationTravel("Select cities");
                    }
                    UpdateCitiesFrance();
                })
        .on("mouseout",function(d){
            d3.select(this).style("cursor", "default")
            d3.select('#dynamic_'+d.City).transition().duration(50).style("r", radius_dynamic);
            d3.select('#static_'+d.City).transition().duration(50).style("r", radius_static);
        });



    })
}

function UpdateCitiesFrance(){
    // My_reference = {City: "Grenoble", plong: 257.1682882326301, plat: 165.49279245973003}
    g = d3.select("g")

    // DYNAMIC LINKS
    if (typeof My_reference=='undefined'){
        var output = document.getElementById("alpha_span");
        output.innerHTML = select_text;

        g.selectAll(".dir_line")
            .attr("opacity",0)

        g.selectAll(".Cities")
            .transition().duration(move_time)
            .attr("cx", function(d) {return d.plong;} )
            .attr("cy", function(d) {return d.plat;} )
            .attr("r", radius_dynamic)
            .style("fill", dynamic_color);

        g.selectAll(".Static_Cities")
            .transition().duration(move_time)
            .attr("r", 0.0001)

        g.selectAll(".iso_circles")
            .attr("cx",Paris.plong)
            .attr("cy",Paris.plat)
            .attr("opacity",function(d){
                return 0.00;
            })
            .attr("r",0)
        g.selectAll(".iso_label")
            .attr("x",Paris.plong)
            .attr("y",Paris.plat)
            .attr("opacity",0.0001)
    
    }else{
        var output = document.getElementById("alpha_span");
        output.innerHTML = play_text;
        g.selectAll(".iso_circles")
            .transition().duration(function(d){return move_time*2/d.NB_hour})
            .attr("cx",My_reference.plong)
            .attr("cy",My_reference.plat)
            .attr("opacity",function(d){
                return 1 - d.NB_hour/12
            })
            // .transition().duration()
            .attr("r", function(d){
                return (d.NB_hour)*3600*alpha;
            })

            
        // g.selectAll(".iso_label")
        //     .attr("y",My_reference.plat)
        //     .attr("x",function(d){
        //         if(My_reference.plong<Paris.plong){
        //             return My_reference.plong + d.r;
        //         }else{
        //             return My_reference.plong - d.r;
        //         }
        //     })

        // DYNAMIC CITIES
        g.selectAll(".Cities").filter(function(d){return My_reference.City != d.City })
            .transition().duration(move_time)
            .attr("cx", function(d) {return new_coord(alpha*d["dist"][My_reference.City], [My_reference.plong,My_reference.plat], [d.plong,d.plat])[0];} )
            .attr("cy", function(d) {return new_coord(alpha*d["dist"][My_reference.City], [My_reference.plong,My_reference.plat], [d.plong,d.plat])[1];} )
            .attr("r", radius_dynamic)
            .style("fill", dynamic_color);

        g.selectAll(".Cities")
            .filter(function(d){return My_reference.City == d.City;})
            .transition().duration(move_time)
            .attr("cx", function(d){return d.plong;})
            .attr("cy", function(d){return d.plat;})
            .attr("r",radius_main)
            .style("fill",main_color)

        g.selectAll(".Static_Cities")
            .transition().duration(move_time)
            .attr("r", radius_static)
            .style("fill", static_color);

        g.selectAll(".dir_line").filter(function(d){return My_reference.City != d.City })
            // .attr("x1", function(d) {return My_reference.plong;})
            // .attr("y1", function(d) {return My_reference.plat;})
            .transition().duration(move_time)
            .attr("x1", function(d) {return d.plong;})
            .attr("y1", function(d) {return d.plat;})
            .attr("x2", function(d) {
                if(typeof d["dist"][My_reference.City]!== 'undefined'){
                    return new_coord(alpha*d["dist"][My_reference.City], [My_reference.plong,My_reference.plat], [d.plong,d.plat])[0];
                }else{
                    return d.plong;
                }} )
            .attr("y2", function(d) {
                if(typeof d["dist"][My_reference.City]!== 'undefined'){
                    return new_coord(alpha*d["dist"][My_reference.City], [My_reference.plong,My_reference.plat], [d.plong,d.plat])[1];
                }else{
                    console.log(d.plong)
                    return d.plat;
                }})
            // .attr("y2",  My_reference.plat)
            .attr("opacity", function(d){
                if(typeof d["dist"][My_reference.City]!== 'undefined'){
                    return(1)
                }else{
                    return(0)
                } 
            })
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


function mapEuropeDisplay(Which_map = "Europe"){

    // Canvas
    var width = 600,
    height = 500;


    // Projection
    var svg = d3.select(".mapColumn").append("svg")
      .attr("width", width)
      .attr("height", height);
    var g = svg.append("g");
    var projection = d3.geoConicConformal().center([36,53]).scale(700);
    var path = d3.geoPath().projection(projection);

    // Define the div for the tooltip
    // var div = d3.select("body")
    //     .append("div")   
    //     .attr("class", "tooltip")               
    //     .style("opacity", 1)
    //     .attr("html","test")
        //.style("background", "lightsteelblue");
        // TODO : le css n'est pas utilisé pour div.tooltip. Pourquoi ??

    // BACKGROUND OF THE MAP
    d3.json("data/europe.json", function(json) {
        g.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", France_color);
    });

    d3.csv("data/Europe-Cities_lat_long.csv", function(cities) {
        console.log("projecting French cities")
        cities.forEach(function(d){
            d.long = parseFloat(d.long)
            d.lat = parseFloat(d.lat)
            var projected_city = projection([d.long, d.lat])
            d.plong = projected_city[0]
            d.plat = projected_city[1] 
            d.dist = -1     
            if(d.City=="Paris"){
                Paris = {}
                Paris.plat = d.plat;
                Paris.plong = d.plong;
            }          
        }) 
        // associer à chaque ville un dictionniare avec pour chaque autre ville ses voisins.

        d3.csv("data/Europe-Cities_Distance_Matrix.txt",function(distances){
            for(var city_index = 0 ; city_index<distances.length;city_index++){
                var the_city = cities[city_index]["City"]
                for(var dist_index = 0 ; dist_index<distances.length;dist_index++){
                    if(distances[dist_index][""] == the_city){
                        delete distances[dist_index][""]
                        for(var key in distances[dist_index]){
                           distances[dist_index][key] = parseFloat(distances[dist_index][key])
                           if(isNaN(distances[dist_index][key])){
                            distances[dist_index][key] = undefined
                           }
                        }
                        cities[city_index]["dist"] = distances[dist_index]
                        break
                    }
                }
            }
        })
        console.log(JSON.stringify(cities[0]["dist"]))
        console.log(cities)
        console.log(Object.keys(cities[0]))
        // Tous les import de données initiaux se font ici.
        var g = d3.select("g")

    // APPEND ISOCHRONES CIRCLES

    // var A = [cities[0].plat,cities[0].plong]
    // console.log(JSON.stringify(cities[0]))
    // var B = new_coord(alpha*cities[0]["dist"][cities[1]["City"]], [cities[0].plong,cities[0].plat], [cities[1].plong,cities[1].plat])

    // var B = new_coord(alpha*12060, [cities[0].plong,cities[0].plat], [cities[1].plong,cities[1].plat])
    an_hour = 3600 * alpha//*norme([B[0]-A[0],B[1]-A[1]])/( 12060) hard codé car l'élément dist est apparemment crée ensuite !

    console.log("An hour is worth (px) :")
    console.log(an_hour)
    
    var isoH  = []
    d3.range(12).forEach(function(d){
        isoH.push({"NB_hour":d+1,"label": String(d+1) + "h", "r" : (d+1)*an_hour})
    })
    isoH = isoH.reverse()

    g.selectAll(".iso_circles")
      .data(isoH)
      .enter()
      .append("circle")
        .attr("class","iso_circles")
        .attr("r",function(d){
            return d.r;
        })
        .attr("cx",projection([48.856614,2.35])[0])
        .attr("cy",projection([48.856614,2.35])[1])
        .attr("opacity",0)
        .on("mousemove", function(d){
            d3.select("#iso_label"+d.NB_hour)
            .attr("x",mouse_position[0]-28)
            .attr("y",mouse_position[1]-95)
            .attr("opacity",1)
        })
        .on("mouseout", function(d){
            d3.select("#iso_label"+d.NB_hour).attr("opacity",0)
        })


    g.selectAll(".iso_label")
          .data(isoH)
          .enter()
          .append("text")
              .attr("class", "iso_label")
              .attr("id",function(d){return "iso_label"+d.NB_hour;})
              .attr("x", projection([48.856614,2.35])[0])
              .attr("y", function(d) {var y = projection([48.856614,2.35])[1]; return y; }) //faux mais osef
              .attr("font-size", "10px")
              .attr("opacity",0)
              .text(function(d) {return d.label;});

    
    // INITIALIZE TRANSPARENT LINES
    g.selectAll("line")
        .data(cities)
        .enter()
        .append("line")
            .attr("class","dir_line")
            .attr("x1", function(d) {return d.plong;})
            .attr("y1", function(d) {return d.plat;})
            .attr("x2", projection([2.35,48.856614])[0])
            .attr("y2",  projection([2.35,48.856614])[1])
            .attr("opacity",0)

     // STATIC CITIES
        g.selectAll('.Static_Cities')
                .data(cities)
                .enter()
                .append('circle')
                    .attr("class","Static_Cities")
                    .attr("cx", function(d) {return d.plong;})
                    .attr("cy", function(d) { return d.plat;})
                    .attr("position","absolute")
                    .attr("z-index", 4)
                    //.attr("r", 3.5) //pas de rayon initialement !
                    .style("fill", static_color)
                    .style("opacity",0.8)
                    .on("click",function(d){
                        changeInformationCityOrigin(d.City, d.City + ".jpg");
                        if(typeof My_reference !== 'undefined'){
                            if(My_reference.City !=d.City){
                                My_reference = {City :d.City, plong : d.plong, plat : d.plat};
                                console.log(My_reference);
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
                .attr("position","absolute")
                .attr("z-index", 4)
                // .on("mouseover", function(d) {
                //     div.transition()
                //         .duration(200)
                //         .style("opacity",0.9)
                //     div.html(d.City) //"<br/>"   
                //         .style("left", (d3.event.pageX +5) + "px")     
                //         .style("top", (d3.event.pageY - 25) + "px");
                // })
                // .on("mouseout", function(d) {       
                //     div.transition()        
                //         .duration(100)      
                //         // .style("opacity", 0);   
                // })
                .on("click",function(d){
                    changeInformationCityOrigin(d.City, d.City + ".jpg");
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

    // APPEND TOOLTIP
    g.selectAll(".city_label")
      .data(cities)
      .enter()
      .append("text")
          .attr("class", "city_label user-select-none")
          .attr("x", function(d) { return d.plong-10; })
          .attr("y", function(d) { return d.plat +13; })
          .attr("font-size", "12px")
          .text(function(d) { return d.City;});




    // div.data(cities).attr("html",function(d){return d.City;})
    //                 .attr("left",function(d){return (d3.event.pageX +5) + "px";}) 
    //                 .attr("top", function(d){return (d3.event.pageY - 25) + "px";})

    })
}

function changeInformationCityOrigin(name, imgName){
    document.getElementById("originName").textContent = name;
    var originImg = document.getElementById("originImg").src = "./img/City_pic/" + imgName;
}

function changeInformationCityDestination(name, imgName){
    document.getElementById("destinationName").textContent = name;
    var originImg = document.getElementById("destinationImg").src = "./img/City_pic/" + imgName;
}

function changeInformationTravel(time){
    document.getElementById("time").textContent = time;
}

function convertSecondToHours(second){
    minut = Math.trunc(second / 60);
    hour = Math.trunc(minut / 60);
    minut = minut % 60;
    if(minut < 9)
        minut = "0" + minut;
    return hour + "h " + minut + "m";
}


function mouseListener(){

    var x = null;
    var y = null;
    document.getElementById("drawMap").addEventListener('mousemove', onMouseUpdate, false);
    document.getElementById("drawMap").addEventListener('mouseenter', onMouseUpdate, false);

    function onMouseUpdate(e) {
        if(typeof My_reference !== 'undefined'){
            x = e.pageX;
            y = e.pageY;
            mouse_position = [x,y]
        }
    }

    function getMouseX() {
        return x;
    }

    function getMouseY() {
        return y;
    }
}

function getTimeBetweenTwoCities(My_reference, My_destination, cities){
    var i = 0;
    var isFound = 0;
    while(i < cities.length && isFound == false){
        if (cities[i].City == My_destination.City) {
            var timeHours = convertSecondToHours(cities[i].dist[My_reference.City])
            changeInformationTravel(timeHours);
            isFound = true;
        }
        i++;
    }
}

init();
