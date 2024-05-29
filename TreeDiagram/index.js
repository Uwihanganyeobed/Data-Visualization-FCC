document.addEventListener('DOMContentLoaded', () => {
    const dataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

    fetch(dataURL)
        .then(response => response.json())
        .then(data => createTreemap(data));
});

function createTreemap(data) {
    const width = 960;
    const height = 600;

    const svg = d3.select('#chart')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    const root = d3.hierarchy(data)
                   .sum(d => d.value)
                   .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .padding(1)
      (root);

    const color = d3.scaleOrdinal()
                    .domain(data.children.map(d => d.name))
                    .range(d3.schemeCategory10);

    const tooltip = d3.select('#tooltip');

    svg.selectAll('g')
       .data(root.leaves())
       .enter()
       .append('g')
       .attr('transform', d => `translate(${d.x0},${d.y0})`)
       .append('rect')
       .attr('class', 'tile')
       .attr('data-name', d => d.data.name)
       .attr('data-category', d => d.data.category)
       .attr('data-value', d => d.data.value)
       .attr('width', d => d.x1 - d.x0)
       .attr('height', d => d.y1 - d.y0)
       .attr('fill', d => color(d.data.category))
       .on('mouseover', (event, d) => {
           tooltip.style('opacity', 0.9)
                  .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                  .attr('data-value', d.data.value)
                  .style('left', `${event.pageX + 5}px`)
                  .style('top', `${event.pageY - 28}px`);
       })
       .on('mouseout', () => {
           tooltip.style('opacity', 0);
       });

    svg.selectAll('g')
       .append('text')
       .attr('x', 5)
       .attr('y', 20)
       .text(d => d.data.name)
       .attr('fill', 'white')
       .attr('font-size', '12px');

    // Legend
    const legend = d3.select('#legend')
                     .append('svg')
                     .attr('width', 300)
                     .attr('height', 300)
                     .attr('id', 'legend');

    const categories = Array.from(new Set(data.children.map(d => d.name)));

    const legendItem = legend.selectAll('.legend-item')
                             .data(categories)
                             .enter()
                             .append('g')
                             .attr('class', 'legend-item')
                             .attr('transform', (d, i) => `translate(0, ${i * 30})`);

    legendItem.append('rect')
              .attr('width', 20)
              .attr('height', 20)
              .attr('fill', d => color(d));

    legendItem.append('text')
              .attr('x', 30)
              .attr('y', 15)
              .text(d => d);
}
