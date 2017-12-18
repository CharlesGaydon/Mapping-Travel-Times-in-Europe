<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <script src="https://d3js.org/d3.v4.min.js"></script>
  <style>
    body { margin:0;position:fixed;top:0;right:0;bottom:0;left:0; }
  </style>
</head>

<body>
  <script>

    var width = 700,
        height = 580;
    
    var paris = [48.862725,2.287592];
    
    var plng = 48;
    
    var plat = 2;

    var svg = d3.select( "body" )
      .append( "svg" )
      .attr( "width", width )
      .attr( "height", height );

    // On rajoute un groupe englobant toute la visualisation pour plus tard
    var g = svg.append( "g" ); 
    
    var projection = d3.geoConicConformal().center([2.454071, 46.279229]).scale(2800);

    
    var path = d3.geoPath()
                 .projection(projection);
    
    d3.json("france.json", function(json) {
            console.log(json)
            g.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("fill", "#ccc")
    });
    
    // Chargement des donnees
    d3.csv("French-cities_lat_long.csv", function(error, data) {
      
      data.forEach(function(d) {
        d.plng = 2.287592;
        d.plat = 48.862725;
      });
       g.selectAll("line")
         .data(data)
         .enter()
         .append("line")
          .attr("x1", function(d) {return projection([d.long, d.lat])[0];})
          .attr("y1", function(d) {return projection([d.long, d.lat])[1];})
          .attr("x2", function(d) {return projection([d.plng, d.plat])[0]})
         .attr("y2", function(d) {return projection([d.plng, d.plat])[1];})
          .attr("stroke","grey")
          .attr("stroke-width",1)
          .attr("stroke-dasharray",4);
        g.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
                   return projection([d.long, d.lat])[0];
           })
           .attr("cy", function(d) {
                   return projection([d.long, d.lat])[1];
           })
           .attr("r", 15)
           .style("fill", "yellow");
      
      
      
      
    });

    
  </script>
</body>





    