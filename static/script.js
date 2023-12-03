let data = [];

function generateRandomData() {
    data = [];
    const width = 500, height = 500, numPoints = 100;
    for(let i = 0; i < numPoints; i++) {
        data.push({x: Math.random() * width, y: Math.random() * height});
    }

    // Limpia el div chart y prepara para nueva visualización
    const chart = d3.select("#chart").html("");
    const svg = chart.append("svg").attr("width", width).attr("height", height);

    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", d => d.x)
       .attr("cy", d => d.y)
       .attr("r", 5)
       .style("fill", "blue");
}


function runKmeans() {
    const nClusters = parseInt(document.getElementById('nClusters').value);
    const formattedData = data.map(d => [d.x, d.y]);
    fetch('/run-kmeans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: formattedData, n_clusters: nClusters})
    })
    .then(response => response.json())
    .then(result => {
        visualizeResults(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function visualizeResults(result) {
    const colors = ["red", "green", "blue", "purple", "orange", "cyan", "magenta", "yellow", "brown", "grey"];
    const chart = d3.select("#chart").select("svg");

    // Visualizar los puntos
    chart.selectAll("circle")
        .data(data)
        .style("fill", d => colors[result.labels[data.indexOf(d)]])
        .style("opacity", 0.6);

    // Visualizar los centros de los clústeres
    chart.selectAll("rect")
        .data(result.centers)
        .enter()
        .append("rect")
        .attr("x", d => d[0] - 10)
        .attr("y", d => d[1] - 10)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", (d, i) => colors[i])
        .style("opacity", 0.9);
}
