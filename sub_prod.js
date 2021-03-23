"use strict";
var dataset;
var subdata = [];
//load data
d3.csv("data/subproducts.csv").then(function(data, error){  
    if (error) 
    {
        d3.select("#subprod").append("p")
            .text("Data failed to load");
    } 
    else 
    {
        //log dataset to console
        console.log(data)
        //process data from csv file
        data.forEach(function(d) {
            d.Product = d.Product;
            d.Land = +d.Land;
            d.GHG = +d.GHG;
            d.Freshwater = +d.Freshwater;
            d.Eutrophying = +d.Eutrophying;
        })
        //set dataset with data from csv
        subdata = data;
    }
});  


function subbarChart()
{

    //define margins, width and height
    var margin = {top: 20, right: 30, bottom: 40, left: 60};
    var w = 1000 - margin.left - margin.right;
    var h = 400 - margin.top - margin.bottom;

    var dataset = subdata;
    //create svg
    var svg = d3.select("#subprod")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
            .attr("x", w / 2)
            .attr("y", 0 + margin.top/2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Land Use");

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
            return d.Land;
        })])
        .range([h, 0]);
        
    svg.append("g")
        .call(d3.axisLeft(y))
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
    .text("Land Usage (m\u00B2/FU)");
        
    //make tooltip 
    var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);  
    var color = "#a0af14";

    //create bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.Product); })
        .attr("y", function(d) { return y(d.Land); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return h - y(d.Land); })
        .attr("fill", "#a0af14")
        .on("mouseover", function(d) { 
            d3.select(this)
                .transition()
                .duration(250)
                .attr("fill", "#ffa600");   
            div.transition()        
                .duration(200)    
                .style("opacity", .9);      
            div.html( d.Product + "<br/>" + d.Land)  
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

    //if land button is clicked
    d3.select("#land2")
        .on("click", function() {
            var delBar = svg.selectAll("*"). remove()
            svg.append("text")
            .attr("x", w / 2)
            .attr("y", 0 + margin.top/2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Land Use");
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
                    return d.Land;
                })])
                .range([h, 0]);
                
            svg.append("g")
                .call(d3.axisLeft(y))
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
                .text("Land Usage (m\u00B2/FU)");
                    
            //make tooltip 
            var div = d3.select("body").append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);
            //set color for tooltips
            color = "#a0af14";
            //create bars
            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.Product); })
                .attr("y", function(d) { return y(d.Land); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return h - y(d.Land); })
                .attr("fill", color)
                .on("mouseover", function(d) { 
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr("fill", "#ffa600");   
                    div.transition()        
                        .duration(200)    
                        .style("opacity", .9);      
                    div.html( d.Product + "<br/>" + d.Land)  
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
                });

    //if ghg button is clicked
    d3.select("#ghg2")
        .on("click", function() {  
            var delBar = svg.selectAll("*"). remove()
            svg.append("text")
            .attr("x", w / 2)
            .attr("y", 0 + margin.top/2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("GHG emissions");
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
                    return d.GHG;
                })])
                .range([h, 0]);
            
            svg.append("g")
                .call(d3.axisLeft(y))
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
            .text("GHG Emissions (kgCO\u00B2 eq/FU)");
                
            //make tooltip 
            var div = d3.select("body").append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);

            //set color for tooltips
            var color = "#296584";
            
            //create bars
            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.Product); })
                .attr("y", function(d) { return y(d.GHG); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return h - y(d.GHG); })
                .attr("fill", color)
                .on("mouseover", function(d) { 
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr("fill", "#ffa600");   
                    div.transition()        
                        .duration(200)    
                        .style("opacity", .9);      
                    div.html( d.Product + "<br/>" + d.GHG)  
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
        })

    //if ghg button is clicked, use ghg_data as the dataset
    d3.select("#eutro")
    .on("click", function() {  
        var delBar = svg.selectAll("*"). remove()
        svg.append("text")
        .attr("x", w / 2)
        .attr("y", 0 + margin.top/2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Eutrophying Emissions");
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
                    return d.Eutrophying;
                })])
                .range([h, 0]);


            svg.append("g")
                .call(d3.axisLeft(y))  
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
            .text("Eutrophying Emissions (gPO\u2084 \u207B \u00b3eq/FU)");
                        
            //make tooltip 
            var div = d3.select("body").append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);

            //set color for tooltips
            var color = "#009f6b";

            //create bars
            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.Product); })
                .attr("y", function(d) { return y(d.Eutrophying); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return h - y(d.Eutrophying); })
                .attr("fill", color)
                .on("mouseover", function(d) { 
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr("fill", "#ffa600");   
                    div.transition()        
                        .duration(200)    
                        .style("opacity", .9);      
                    div.html( d.Product + "<br/>" + d.Eutrophying)  
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
    })
    //if ghg button is clicked, use ghg_data as the dataset
    d3.select("#water")
    .on("click", function() {  
        var delBar = svg.selectAll("*"). remove()
        svg.append("text")
        .attr("x", w / 2)
        .attr("y", 0 + margin.top/2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Freshwater Use");
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
                    return d.Freshwater;
                })])
                .range([h, 0]);
            
            svg.append("g")
                .call(d3.axisLeft(y))
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
            .text("Freshwater Use (kL)");
                        
            //make tooltip 
            var div = d3.select("body").append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);

            //set color for tooltips
            var color = "#00858f";

            //create bars
            svg.selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.Product); })
                .attr("y", function(d) { return y(d.Freshwater); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return h - y(d.Freshwater); })
                .attr("fill", color)
                .on("mouseover", function(d) { 
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr("fill", "#ffa600");   
                    div.transition()        
                        .duration(200)    
                        .style("opacity", .9);      
                    div.html( d.Product + "<br/>" + d.Freshwater)  
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
    })
}

//load chart
window.addEventListener('load', function (){
    subbarChart();
 });