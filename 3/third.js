document.addEventListener('DOMContentLoaded', () => {
    // Define the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 50, left: 60 }, // Adjusted bottom margin for X-axis label
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select("#chart5")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Date / Time
    const parseTime = d3.timeParse("%Y");

    // Set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Define the area
    const area = d3.area()
        .x(function (d) { return x(d.Year); })
        .y0(height)
        .y1(function (d) { return y(d.Total_expenditure); });

    // Read the CSV file
    d3.csv("../assets/export_file_5.csv").then((data) => {
        // Format the data
        data.forEach((d) => {
            d.Year = parseTime(d.Year);
            d.Total_expenditure = +d.Total_expenditure;
        });

        // Get a list of unique countries
        const countries = [...new Set(data.map((d) => d.Country))];

        // Sort countries by maximum total expenditure
        countries.sort((a, b) => {
            const maxExpenditureA = d3.max(data.filter((d) => d.Country === a), (d) => d.Total_expenditure);
            const maxExpenditureB = d3.max(data.filter((d) => d.Country === b), (d) => d.Total_expenditure);
            return maxExpenditureB - maxExpenditureA; // Note: sorting in descending order
        });

        // Define color scale for countries
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        const colorScale2 = ['rgba(31, 119, 180, 1)', 'rgba(255, 127, 14, 0.9)', 'rgba(44, 160, 44, 0.8)', 'rgba(214, 39, 40, 0.7)', 'rgba(166, 0, 159, 0.6)']
        // Set the domains for X and Y scales
        x.domain(d3.extent(data, function (d) { return d.Year; }));
        y.domain([0, d3.max(data, function (d) { return d.Total_expenditure; }) + 10]);

        // Add the X-axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y-axis
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // Add X-axis label
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")") // Adjusted Y position
            .style("text-anchor", "middle")
            .text("Year");

        // Add Y-axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Total Expenditure");

        // Add tooltips
        const tooltip = d3.select("#chart5")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Add a legend for countries
        const legend = svg.selectAll(".legend")
            .data(countries)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) { return colorScale(d) });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; });

        const mouseover = function (event, d) {
            let ave_Total_expenditure = 0
            d.forEach((a) => {
                ave_Total_expenditure += a.Total_expenditure
            })
            ave_Total_expenditure = ave_Total_expenditure / 15
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`Country: ${d[0].Country}<br>Mean Total Expenditure: <b>${ave_Total_expenditure}</b>`)
                .style("left", (event.pageX - 240) + "px")
                .style("top", (event.pageY - 110) + "px");
        }

        const mouseout = function (event, d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }

        // Add the area for each country with tooltips
        countries.forEach((country, index) => {
            let countryData = data.filter(function (row) { return row.Country === country; });

            // Add the area for this country
            svg.append("path")
                .data([countryData])
                .attr("class", "area")
                .attr("d", area)
                .style("fill", colorScale2[index])
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);
        });
    });

});
