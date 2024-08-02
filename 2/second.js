document.addEventListener('DOMContentLoaded', () => {

    // Set the dimensions and margins of the graph
    const margin = { top: 40, right: 40, bottom: 60, left: 60 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read the data
    d3.csv("../assets/export_file_2.csv").then((data) => {

        // Convert strings to numbers
        data.forEach((d) => {
            d['Immunization Coverage'] = +d['Immunization Coverage'];
            d['Adult Mortality'] = +d['Adult Mortality'];
            d['Life expectancy'] = +d['Life expectancy'];
        });

        // Add X axis
        const x = d3.scaleLinear()
            .domain([90, d3.max(data, (d) => d['Immunization Coverage'])])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Immunization Coverage (%)");

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 300])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Adult Mortality");

        // Bubble size scale
        let bubbleScale = d3.scaleSqrt()
            .domain([0, 110])
            .range([-80, 35]);

        // Add bubbles with tooltips
        const tooltip = d3.select("#scatterplot").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("g")
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("cx", (d) => x(+d['Immunization Coverage']))
            .attr("cy", (d) => y(+d['Adult Mortality']))
            .attr("r", (d) => bubbleScale(+d['Life expectancy']))
            .style("fill", "rgb(205, 66, 227)")
            .style("opacity", "0.7")
            .attr("stroke", "black")
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Country: ${d['Country']} <br/> Life Expectancy: ${d['Life expectancy']} <br/> Immunization Coverage: ${d['Immunization Coverage']}% <br> Adult Mortality: ${d['Adult Mortality']}`)
                    .style("left", (event.pageX - 20) + "px")
                    .style("top", (event.pageY - 80) + "px");
            })
            .on("mouseout", (d) => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add axes labels
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width / 2 + 100)
            .attr("y", height + 40)
            .text("Immunization Coverage (%)");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -50)
            .attr("dy", ".75em")
            .attr("dx", "-130")
            .attr("transform", "rotate(-90)")
            .text("Adult Mortality");
    });

});