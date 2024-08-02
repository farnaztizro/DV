
document.addEventListener('DOMContentLoaded', () => {
    const margin = { top: 50, right: 0, bottom: 100, left: 50 },
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${120},${100})`);

    d3.csv("../Preprocessed_Scatter_Plot_Data.csv").then((data) => {
        // Convert string values to numbers
        data.forEach(d => {
            d.Average_Life_Expectancy = +d.Average_Life_Expectancy;
            d.Average_GDP = +d.Average_GDP;
            d.Average_Population = +d.Average_Population;
        });

        // Sort data by Average GDP and take top 10
        const topData = data.sort((a, b) => b.Average_GDP - a.Average_GDP).slice(0, 10);

        const countries = topData.map(d => d.Country);
        const metrics = ["Average_Life_Expectancy", "Average_GDP", "Average_Population"];

        const x = d3.scaleBand()
            .range([0, width])
            .domain(countries)
            .padding(0.01);

        const y = d3.scaleBand()
            .range([height, 0])
            .domain(metrics)
            .padding(0.01);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));

        const colorScales = {
            "Average_Life_Expectancy": d3.scaleSequential(d3.interpolateBlues)
                .domain([d3.min(topData, d => d.Average_Life_Expectancy), d3.max(topData, d => d.Average_Life_Expectancy)]),
            "Average_GDP": d3.scaleSequential(d3.interpolateGreens)
                .domain([d3.min(topData, d => d.Average_GDP), d3.max(topData, d => d.Average_GDP)]),
            "Average_Population": d3.scaleSequential(d3.interpolateReds)
                .domain([d3.min(topData, d => d.Average_Population), d3.max(topData, d => d.Average_Population)])
        };

        const tooltip = d3.select("#tooltip");

        function showTooltip(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Country: ${d.Country}<br/>Metric: ${d.metric}<br/>Value: ${d.value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        }

        function hideTooltip() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        }

        const heatmapData = [];

        topData.forEach(d => {
            metrics.forEach(m => {
                heatmapData.push({ Country: d.Country, metric: m, value: d[m] });
            });
        });

        svg.selectAll()
            .data(heatmapData)
            .enter()
            .append("rect")
            .attr("x", d => x(d.Country))
            .attr("y", d => y(d.metric))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => colorScales[d.metric](d.value))
            .attr("class", "cell")
            .on("mouseover", showTooltip)
            .on("mousemove", showTooltip)
            .on("mouseout", hideTooltip);
    });
});