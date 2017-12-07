console.log("START");
function init() {
	console.log("init");
	console.log(document.getElementById("test"));
	document.getElementById("test").innerHTML = "Paragraph add with JS";
	tp4DataViz();
}


function tp4DataViz(){
	var width = 700,
  		  height = 580;

		var svg = d3.select( "body" )
  		.append( "svg" )
		  .attr( "width", width )
		  .attr( "height", height );
    
    var tooltip = d3.select('body').append('div')
    	.attr('class', 'hidden tooltip');
    
    var g = svg.append("g");

    var projection = d3.geoConicConformal().center([2.454071, 46.279229]).scale(2800);

    var path = d3.geoPath() // d3.geo.path avec d3 version 3
                 .projection(projection);
    
    var color = d3.scaleQuantize()
     .range(["rgb(237,248,233)", "rgb(186,228,179)",
     "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);
    
    
    d3.csv("data/GrippeFrance2014.csv", function(data) {
      d3.json("data/regions.json", function(json) {
        //On fusionne les donnees avec le GeoJSON des regions
        for (var i = 0; i < data.length; i++) {
          var dataValue = parseFloat(data[i].somme2014);
          // On récupère les valeurs de novembre 2014
          var dataValueNovembre = parseInt(data[i]["02/11/14"]) + 
              parseInt(data[i]["09/11/14"]) +
              parseInt(data[i]["16/11/14"]) +
              parseInt(data[i]["23/11/14"]) +
              parseInt(data[i]["30/11/14"]);
          
          var dataRegion = data[i].region;
          
    			// build the index
    			/*
          var dataWeek;
          for (var x in data[i]) {
            if (x != "region" || x != "somme2014"){
              dataWeek = data[i][x];
              console.log(dataWeek[0]);
            }
          }
          */
          
          for (var j = 0; j < json.features.length; j++) {
            var jsonState = json.features[j].properties.nom;
            if (dataRegion == jsonState) {
         			//On injecte la valeur de l'Etat dans le json
              json.features[j].properties.value = dataValue;
              json.features[j].properties.valueNov = dataValueNovembre;
         			//Pas besoin de chercher plus loin
              break;
            }
          }
        };
        
        
        g.selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", function(d) {
          //on prend la valeur recuperee plus haut
          var value = d.properties.value;
          var valueNov = d.properties.valueNov;
          if (value) {
            //color.domain([0, 2000]);
            //return color(value);
            color.domain([0, 200]);
            return color(valueNov);
          } else {
            // si pas de valeur alors en gris
            return "#ccc";
          }})
          .attr('class', function(d) {
            return 'province ' + d.properties.code;
          })
          .on('mousemove', function(d) {
            var mouse = d3.mouse(svg.node()).map(function(d) {
              return parseInt(d);
            });
            tooltip.classed('hidden', false)
              .attr('style', 'left:' + (mouse[0] + 15) +
                    'px; top:' + (mouse[1] - 35) + 'px')
              .html(d.properties.nom + "<br>" + d.properties.valueNov);
            })
          .on('mouseout', function() {
          	tooltip.classed('hidden', true);
          });
      });
    });
}
// elsewhere in code
init();