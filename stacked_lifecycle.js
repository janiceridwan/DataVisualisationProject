function init() {
    var margin = {top: 20, right: 30, bottom: 30, left: 60};
    var w = 1000 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;



    var dataset = [];

    d3.csv("data/GHG_lifecycle.csv").then(function(data, error){  
        if (error) 
        {
            d3.select("#bartotal").append("p")
                .text("Data failed to load");
        } 
        else 
        {
            data.forEach(function(d) {
                d.Product = d.Product;
                d.Land = +d.Land;
                d.Feed = +d.Feed;
                d.Farm = +d.Farm;
                d.Processing = +d.Processing;
                d.Transport = +d.Transport;
                d.Packaging = +d.Packaging;
                d.Retail = +d.Retail;
            })
            dataset = data;
            console.log(dataset);
        }
    });  
    var stack = d3.stack()
        .keys(["Land", "Feed", "Farm", "Processing", "Transport", "Packaging", "Retail"]);

    var series = stack(dataset);

    var svg = d3.select("#stackedbar")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scaleOrdinal(["#296584", "#007b91", "#008f88", "#009f6b", "#63ab40", "#afaf02", "#ffa600"]);

    var groups = svg.selectAll("g")
        .data(series)
        .enter()
        .append("g")
        .style("fill", function (d) {
            return color(d.Product);
        });

    // x Scale
    var xScale = d3.scaleBand()
        .range([0, w])
        .domain(dataset.map(function(d) { return d.Product; }))
        .padding(0.4);

    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("class", "xaxis")
        .style("text-anchor", "center")
    

    // y Scale
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return d.Land + d.Feed + d.Farm + d.Processing + d.Transport + d.Packaging + d.Retail;
        })
        ])
        .range([h, 0]);
        
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Draw the rectangles
    var rects = groups.selectAll("rect")
        .data(function (d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return xScale(d.data.Product);
        })
        .attr("y", function (d, i) {
            return yScale(d[1]);
        })
        .attr("height", function (d) {
            return yScale(d[0]) - yScale(d[1]);
        })
        .attr("width", xScale.bandwidth());


//     // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 20, left: 50},
// width = 460 - margin.left - margin.right,
// height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#stackedbar")
// .append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)
// .append("g")
// .attr("transform",
//       "translate(" + margin.left + "," + margin.top + ")");

// // Parse the Data
// d3.csv("data/GHG_lifecycle", function(data) {
//     // List of subgroups = header of the csv files = soil condition here
//     var subgroups = data.columns.slice(1)

//     // List of groups = species here = value of the first column called group -> I show them on the X axis
//     var groups = d3.map(data, function(d){return(d.Product)}).keys()

//     // Add X axis
//     var x = d3.scaleBand()
//     .domain(groups)
//     .range([0, width])
//     .padding([0.2])
//     svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSizeOuter(0));

//     // Add Y axis
//     var y = d3.scaleLinear()
//     .domain([0, 60])
//     .range([ height, 0 ]);
//     svg.append("g")
//     .call(d3.axisLeft(y));

//     // color palette = one color per subgroup
//     var color = d3.scaleOrdinal(["#296584", "#007b91", "#008f88", "#009f6b", "#63ab40", "#afaf02", "#ffa600"])


//     //stack the data? --> stack per subgroup
//     var stackedData = d3.stack()
//     .keys(subgroups)
//     (data)

//     // Show the bars
//     svg.append("g")
//     .selectAll("g")
//     // Enter in the stack data = loop key per key = group per group
//     .data(stackedData)
//     .enter().append("g")
//     .attr("fill", function(d) { return color(d.key); })
//     .selectAll("rect")
//     // enter a second time = loop subgroup per subgroup to add all rectangles
//     .data(function(d) { return d; })
//     .enter().append("rect")
//         .attr("x", function(d) { return x(d.data.Product); })
//         .attr("y", function(d) { return y(d[1]); })
//         .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//         .attr("width",x.bandwidth())
//     })
}

window.onload = init;