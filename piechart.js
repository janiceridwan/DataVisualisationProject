"use strict";
var dataset;
var land_data = [];

d3.csv("data/total_land.csv").then(function(data, error){  
    if (error) 
    {
        d3.select("#pietotal1").append("p")
            .text("Data failed to load");
    } 
    else 
    {
        console.log(data)
        data.forEach(function(d) {
            d.Product = d.Product;
            d.Value = +d.Value;
        })
        land_data = data;
    }
});  

function pieChart1() 
{
    var w = 300;
    var h = 180;

    var outerRadius = (w - 150) / 2;
    var innerRadius = 0;
    dataset = land_data;
    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
    
    var pie = d3.pie()
                .value(function(d) {
                    return d.Value;
                });


    var svg = d3.select("#pietotal1")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("transform", "translate(" + w/2 + "," + h/2 + ")");

    var color = d3.scaleOrdinal(["#a0af14", "#cfad00", "#ffa600"]);

    var arcs = svg.selectAll("g.arc")
                    .data(pie(dataset))
                    .enter()
                    .append("g")
                    .attr("class", "arc")
                    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs.append("path")
        .attr("fill", function(d){return color(d.data.Product)})
        .attr("stroke", "white")
        .attr("stroke-width", "2px")
        .attr("d", arc);
    
    arcs.append("text")
        .text(function(d) {
            return Math.round((d.endAngle - d.startAngle)/(2*Math.PI)*100) + "%";
        })
        .style("text-anchor", "middle")
        .style("font-size", 10)
        .attr("fill", "#fff")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        });
    
    var legend = svg.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
        .data(pie(dataset))
        .enter().append("g")
        .attr("transform", function(d, i){
          return "translate(" + (w - 80) + "," + (i * 15 + 10) + ")"; // place each legend on the right and bump each one down 15 pixels
        })
        .attr("class", "legend");   
      
    legend.append("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d){return color(d.data.Product)})

      
    legend.append("text") // add the text
        .text(function(d){
          return d.data.Product;
        })
        .style("font-size", "10")
        .attr("y", "10")
        .attr("x", "11");

}


window.addEventListener('load', function (){
    pieChart1();
 });

  