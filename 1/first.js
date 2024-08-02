document.addEventListener('DOMContentLoaded', () => {
    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 80, bottom: 200, left: 50 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#dual-axis-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("../assets/export_file_1.csv").then((data) => {
        // X axis: scale and draw
        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.Country))
            .padding(0.2);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y0 axis for Average Life Expectancy
        const y0 = d3.scaleLinear()
            .domain([73, d3.max(data, d => +d['Life expectancy'])])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y0));

        const yAxisLeft = svg.append("g")
            .call(d3.axisLeft(y0));

        // Y0 axis title
        yAxisLeft.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.right)
            .attr("dy", "-120")
            .attr("dx", "-120")
            .style("text-anchor", "end")
            .attr("fill", "#000")
            .text("Life Expectancy Range");

        // Y1 axis title
        yAxisLeft.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", width + 40)
            .attr("dy", "-5.1em")
            .style("text-anchor", "end")
            .text("Average Year-Over-Year Change");

        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .text("Country");

        // Adding bars for Average Life Expectancy
        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Country))
            .attr("y", d => y0(+d['Life expectancy']))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y0(+d['Life expectancy']))
            .attr("fill", "rgb(205, 66, 227)")
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);

        // Adding a line for YoY Change
        const line = d3.line()
            .x(d => x(d.Country) + x.bandwidth() / 2)
        //.y(d => y1(+d.YoY_Change));
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        // Define the tooltip for the chart
        const tooltip = d3.select("#tooltip");

        // Function to show the tooltip on hover
        function showTooltip(event, data) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Country: " + data.Country + "<br/>Life Expectancy Range: " + `<b>${+data['Life expectancy']}</b>`
                + "<br/>YoY Change: " + `<b>${data.YoY_Change}</b>`)
                .style("left", (event.pageX - 30) + "px")
                .style("top", (event.pageY - 65) + "px");
        }

        // Function to hide the tooltip
        function hideTooltip() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }
    });
});