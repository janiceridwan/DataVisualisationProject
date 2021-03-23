

function init() {

    var dataset;

    d3.csv("data/GHG_lifecycle.csv", function(d) {
        return {
            // data processing from csv, assigned new variables parsing to date and integer
            product: d.Product,
            Land: parseFloat(d.Land),
            Feed: parseFloat(d.Feed),
            Farm: parseFloat(d.Farm),
            Processing: parseFloat(d.Processing),
            Transport: parseFloat(d.Transport),
            Packaging: parseFloat(d.Packaging),
            Retail: parseFloat(d.Retail)
        };
    }).then(function(data) {
        // set dataset with the data from CSV file
        dataset =  data;
        // log dataset in console
        console.log(dataset);

        // function to generate stacked bar chart
        stackedBar(dataset);
    })
    // catch error if file cannot be read
    .catch(function(error) {
        // log error message in console
        console.log(error);
    });

}

function stackedBar(dataset){
    //set margins, width and height
    var margin = {top: 20, right: 30, bottom: 40, left: 60};
    var w = 950 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

    //create svg
    var svg = d3.select("#stackedbar")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    //create stack
    var stack = d3.stack()
    .keys(["Land", "Feed", "Farm", "Processing", "Transport", "Packaging", "Retail"]);

    //create series
    var series = stack(dataset);
    //check if loaded properly
    console.log(series);

    //define the color scheme 
    var color = d3.scaleOrdinal(["#296584", "#007b91", "#008f88", "#009f6b", "#63ab40", "#afaf02", "#ffa600"]);

    //create rects
    var groups = svg.selectAll("g")
        .data(series)
        .enter()
        .append("g")
        .attr("fill", function (d, i) {
            return color(i);
        });

    console.log(groups)

    //add x axis
    var xScale = d3.scaleBand()
        .range([0, w])
        .domain(dataset.map(function(d) { return d.product; }))
        .padding(0.3)
        .paddingInner(0.4);

    // create x-axis variable
    var xAxis = d3.axisBottom()
    .scale(xScale);

    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("class", "xaxis")
        .style("text-anchor", "center");
    

    // Add Y axis
    var yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, function (d) {
                    return d.Land + d.Feed + d.Farm + d.Processing + d.Transport + d.Packaging + d.Retail;
                    })])
                    .range([h, 0]);
                    
    // create y-axis variable with 15 ticks
    var yAxis = d3.axisLeft()
    .ticks(15)
    .scale(yScale);

    svg.append("g")
        .call(yAxis)
        .selectAll("text")
        .attr("class", "yaxis");

    //make tooltip 
    var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);

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

    // Draw the rectangles
    var rects = groups.selectAll("rect")
    .data(function(d) {return d;})
    .enter()
    .append("rect")
    .attr("x", function (d) {
        return xScale(d.data.product);
    })
    .attr("y", function (d, i) {
        return yScale(d[1]);
    })
    .attr("height", function (d) {
        return yScale(d[0]) - yScale(d[1]);
    })
    .attr("width", xScale.bandwidth())
    .attr("stroke","white").attr("stroke-width",0.3)    
    .on("mouseover", function(d) { 
        
        groups.selectAll("rect")
            .transition()
            .style("opacity", 0.3)


        d3.select(this)
            .transition()
            .duration(250)
            .style("opacity", 1)

        div.transition()        
            .duration(200)    
            .style("opacity", .9);      
        div.html(d3.select(this.parentNode).datum().key  + "<br />" + parseFloat(d[1]-d[0]).toFixed(2))  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");    
        })                  
    .on("mouseout", function(d) {
        groups.selectAll("rect")
            .transition()
            .style("opacity", 1)

        d3.select(this)
            .transition()
            .duration(250)  
            .style("opacity", 1)

        div.transition()        
            .duration(500)     
            .style("opacity", 0);   
    });

    //drawing the legend
    //array of legend color and the key
    var legendColors = [ 
                    ["Land", "#296584"],
                    ["Feed", "#007b91"], 
                    ["Farm", "#008f88"], 
                    ["Processing", "#009f6b"],
                    ["Transport", "#63ab40"], 
                    ["Packaging", "#afaf02"],
                    ["Retail", "#ffa600"]
            ];

    var legend = svg.selectAll(".legend") // append legend to svg
        .data(legendColors)
        .enter().append("g")
        .attr("transform", function(d, i){
          return "translate(" + (w - 80) + "," + (i * 15 + 10) + ")"; //position the legend
        })
        .attr("class", "legend");   
      
    legend.append("rect") // make a matching color rect
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d){return d[1];});

      
    legend.append("text") // add the text
        .text(function(d){
          return d[0];
        })
        .style("font-size", "12px")
        .attr("y", "10")
        .attr("x", "11");
}

    
window.onload = init;