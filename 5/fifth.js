document.addEventListener('DOMContentLoaded', () => {
    const margin = { top: 40, right: 30, bottom: 60, left: 60 },
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip");

    d3.csv("../Preprocessed_Grouped_Bar_Chart_Normalized_Data.csv").then((data) => {
        // Convert string values to numbers
        data.forEach(d => {
            d['Life expectancy'] = +d['Life expectancy'];
            d.GDP = +d.GDP;
            d.Population = +d.Population;
        });

        const subgroups = ['Life expectancy', 'GDP', 'Population'];
        const groups = data.map(d => d.Country);

        const x0 = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding(0.2);

        const x1 = d3.scaleBand()
            .domain(subgroups)
            .range([0, x0.bandwidth()])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x0));

        svg.append("g")
            .call(d3.axisLeft(y));

        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(d3.schemeCategory10);

        svg.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", d => `translate(${x0(d.Country)},0)`)
            .selectAll("rect")
            .data(d => subgroups.map(key => ({ key: key, value: d[key] })))
            .enter().append("rect")
            .attr("x", d => x1(d.key))
            .attr("y", d => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.key))
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${d.key}: ${d.value.toFixed(2)}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        const legend = svg.append("g")
            .attr("transform", `translate(${width - 120}, 0)`);

        legend.selectAll("rect")
            .data(subgroups)
            .enter().append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color);

        legend.selectAll("text")
            .data(subgroups)
            .enter().append("text")
            .attr("x", 24)
            .attr("y", (d, i) => i * 20 + 9)
            .attr("dy", ".35em")
            .text(d => d);
    });
});