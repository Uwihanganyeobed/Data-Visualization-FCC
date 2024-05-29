document.addEventListener('DOMContentLoaded', () => {
   fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
       .then(response => response.json())
       .then(data => createHeatMap(data));
});

function createHeatMap(data) {
   const width = 1200;
   const height = 400;
   const padding = 60;
   
   const baseTemperature = data.baseTemperature;
   const dataset = data.monthlyVariance;

   const xScale = d3.scaleBand()
                    .domain(dataset.map(d => d.year))
                    .range([padding, width - padding])
                    .padding(0.01);

   const yScale = d3.scaleBand()
                    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                    .range([height - padding, padding])
                    .padding(0.01);

   const colorScale = d3.scaleQuantile()
                        .domain([d3.min(dataset, d => baseTemperature + d.variance),
                                 d3.max(dataset, d => baseTemperature + d.variance)])
                        .range(d3.schemeRdYlBu[9].reverse());

   const svg = d3.select('#chart')
                 .append('svg')
                 .attr('width', width)
                 .attr('height', height);

   const xAxis = d3.axisBottom(xScale);
                        }
