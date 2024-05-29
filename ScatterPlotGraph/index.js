document.addEventListener('DOMContentLoaded', () => {
   fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
       .then(response => response.json())
       .then(data => createChart(data));
});

function createChart(data) {
   const width = 800;
   const height = 400;
   const padding = 40;

   const parseTime = d3.timeParse('%M:%S');
   const formatTime = d3.timeFormat('%M:%S');

   data.forEach(d => {
       d.Time = parseTime(d.Time);
   });

   const xScale = d3.scaleLinear()
                    .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
                    .range([padding, width + padding]);

   const yScale = d3.scaleTime()
                    .domain([d3.min(data, d => d.Time), d3.max(data, d => d.Time)])
                    .range([padding, height + padding]);

   const svg = d3.select('#chart')
                 .append('svg')
                 .attr('width', width + 2 * padding)
                 .attr('height', height + 2 * padding);

   const xAxis = d3.axisBottom(xScale)
                   .tickFormat(d3.format('d'));
   const yAxis = d3.axisLeft(yScale)
                   .tickFormat(formatTime);

   svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height + padding})`)
      .call(xAxis);

   svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis);

   svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Time))
      .attr('r', 5)
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.Time)
      .attr('fill', d => d.Doping ? 'red' : 'blue')
      .on('mouseover', (event, d) => {
          const tooltip = d3.select('#tooltip');
          tooltip.style('opacity', 0.9)
                 .html(`Year: ${d.Year}<br>Time: ${formatTime(d.Time)}<br>${d.Doping}`)
                 .attr('data-year', d.Year)
                 .style('left', `${event.pageX + 5}px`)
                 .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
          d3.select('#tooltip').style('opacity', 0);
      });

   const legend = d3.select('#legend');
   legend.append('div')
         .html('<span style="background-color: red; display: inline-block; width: 10px; height: 10px;"></span> Riders with doping allegations');
   legend.append('div')
         .html('<span style="background-color: blue; display: inline-block; width: 10px; height: 10px;"></span> No doping allegations');
}
