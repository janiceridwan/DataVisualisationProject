"use strict";

var dataset;
var land_data = [];
var ghg_data = [];

var margin = {top: 30, right: 30, bottom: 70, left: 60};
    var w = 500 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

d3.csv("data/total_land.csv").then(function(data, error){  
    if (error) 
    {
        d3.select("#chart").append("p")
            .text("Data failed to load");
    } 
    else 
    {
        data.forEach(function(d) {
            d.Product = d.Product;
            d.Value = +d.Value;
        })
        land_data = data;
    }
});  

d3.csv("data/total_ghg.csv").then(function(data, error){  
    if (error) 
    {
        d3.select("#chart").append("p")
            .text("Data failed to load");
    } 
    else 
    {
        data.forEach(function(d) {
            d.Product = d.Product;
            d.Value = +d.Value;
        })
        ghg_data = data;
    }
});  

function init()
{
    var svg = d3.select("#chart1")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    var dataset = land_data;
    // X axis
    var x = d3.scaleBand()
        .range([0, w])
        .domain(dataset.map(function(d) { return d.Product; }))
        .padding(0.4);
    
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("class", "xaxis")
        .style("text-anchor", "center");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return d.Value;
        })])
        .range([h, 0]);
        
    svg.append("g")
        .call(d3.axisLeft(y));
    
    
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.Product); })
        .attr("y", function(d) { return y(d.Value); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return h - y(d.Value); })
        .attr("fill", "#296584")
        
    
    var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
    
    var color = "#296584";

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


    d3.select("#land")
        .on("click", function() {
            dataset = land_data;
            color = "#296584";
            svg.selectAll("rect")
            .data(dataset)
            .transition()
            .attr("x", function(d) { return x(d.Product); })
            .attr("y", function(d) { return y(d.Value); })
            .attr("height", function(d) { return h - y(d.Value); })
            .attr("fill", "#296584")
            registerMouseovers();
    });

    d3.select("#ghg")
        .on("click", function() {  
            dataset = ghg_data;  
            color = "#a0af14";       
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

window.onload = init;