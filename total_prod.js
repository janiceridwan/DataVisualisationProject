"use strict";

var dataset;
var land_data = [];
var ghg_data = [];

//load land data
d3.csv("data/total_land.csv").then(function(data, error){  
    if (error) 
    {
        d3.select("#bartotal").append("p")
            .text("Data failed to load");
    } 
    else 
    {
        //log dataset to console
        console.log(data)
        //process data from csv file
        data.forEach(function(d) {
            d.Product = d.Product;
            d.Value = +d.Value;
        })
        //set land_data with data from dataset
        land_data = data;
    }
});  

//load ghg data
d3.csv("data/total_ghg.csv").then(function(data, error){  
    if (error) 
    {
        d3.select("#bartotal").append("p")
            .text("Data failed to load");
    } 
    else 
    {
        //log data to console
        console.log(data)
        //process data from csv file
        data.forEach(function(d) {
            d.Product = d.Product;
            d.Value = +d.Value;
        })
        //set ghg_data with data from dataset
        ghg_data = data;
    }
});  

function barChart()
{
    //define margins, width and height
    var margin = {top: 20, right: 30, bottom: 40, left: 60};
    var w = 490 - margin.left - margin.right;
    var h = 380 - margin.top - margin.bottom;

    //create svg
    var svg = d3.select("#bartotal")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    var dataset = land_data;

    // X scale and axis
    var x = d3.scaleBand()
        .range([0, w])
        .domain(dataset.map(function(d) { return d.Product; }))
        .padding(0.4);
    
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("class", "xaxis")
        .style("text-anchor", "center")

    //Y scale and axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return d.Value;
        })])
        .range([h, 0]);
        
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .selectAll("text")
        .attr("class", "yaxis");

    // append x-axis text label
    svg.append("text")
    .attr("transform", "translate(" + (w / 2) + " ," + (h + margin.bottom) + ")")
    .style("text-anchor", "middle")
    .text("Product");
     // append y-axis text label
     svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", -margin.left)
     .attr("x",0 - (h / 2))
     .attr("dy", "1em")
     .style("text-anchor", "middle")
     .text("Units");
    
    //create bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.Product); })
        .attr("y", function(d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return h - y(d.Value); })
        .attr("fill", "#a0af14")
        
    //make tooltip 
    var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
    
    var color = "#a0af14";

    //define mouseover with transition colour
    var registerMouseovers = function() {
        svg.selectAll("rect")
        .on("mouseover", function(d) { 
            d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "#ffa600");
                  
            div.transition()        
                .duration(200)    
                .style("opacity", .9);      
            div.html( d.Product + "<br/>" + d.Value)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(250)  
                .attr("fill", color);       
            div.transition()        
                .duration(500)     
                .style("opacity", 0);   
        });
    }
    registerMouseovers();

    //if land button is clicked, use land_data as the dataset
    d3.select("#land")
        .on("click", function() {
            dataset = land_data;
            color = "#a0af14";       
            svg.selectAll("rect")
            .data(dataset)
            .transition()
            .attr("x", function(d) { return x(d.Product); })
            .attr("y", function(d) { return y(d.Value); })
            .attr("height", function(d) { return h - y(d.Value); })
            .attr("fill", color)
            registerMouseovers();
    });

    //if ghg button is clicked, use ghg_data as the dataset
    d3.select("#ghg")
        .on("click", function() {  
            dataset = ghg_data;  
            color = "#296584";
            svg.selectAll("rect")
            .data(dataset)
            .transition()
            .attr("x", function(d) { return x(d.Product); })
            .attr("y", function(d) { return y(d.Value); })
            .attr("height", function(d) { return h - y(d.Value); })
            .attr("fill", color)
            registerMouseovers();
        })
}

function pieChart1() 
{
    var w = 300;
    var h = 180;

    var outerRadius = (w - 150) / 2;
    var innerRadius = 0;
    //set dataset to use
    dataset = land_data;

    //make arcs
    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
    
    //make pie 
    var pie = d3.pie()
                .value(function(d) {
                    return d.Value;
                });

    //create svg            
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
    
    var legend = svg.selectAll(".legend") // append legend to svg
        .data(pie(dataset))
        .enter().append("g")
        .attr("transform", function(d, i){
          return "translate(" + (w - 80) + "," + (i * 15 + 10) + ")"; //position the legend
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

function pieChart2() 
{
    var w = 300;
    var h = 180;

    var outerRadius = (w - 150) / 2;
    var innerRadius = 0;
    dataset = ghg_data;

    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);
    
    var pie = d3.pie()
                .value(function(d) {
                    return d.Value;
                });


    var svg = d3.select("#pietotal2")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    
    var color = d3.scaleOrdinal(["#296584", "#009f6b", "a0af14"]);


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
            return Math.round((d.endAngle - d.startAngle)/(2*Math.PI)*100) + "%";;
        })
        .style("text-anchor", "middle")
        .style("font-size", "7")
        .attr("fill", "#fff")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        });   
    var legend = svg.selectAll(".legend") // append legend to svg
        .data(pie(dataset))
        .enter().append("g")
        .attr("transform", function(d, i){
          return "translate(" + (w - 80) + "," + (i * 15 + 10) + ")"; // position the legend
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
        .style("font-size", 10)
        .attr("y", 10)
        .attr("x", 11);

}


window.addEventListener('load', function (){
    barChart();
});

window.addEventListener('load', function (){
   pieChart1();
});
window.addEventListener('load', function (){
    pieChart2();
 });
 
