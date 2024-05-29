document.addEventListener("DOMContentLoaded", function() {
   // URL to fetch the data
   const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

   // Fetch the data from the URL
   fetch(url)
       .then(response => response.json())
       .then(data => {
           // Extract the GDP data from the fetched JSON
           const dataset = data.data;
           // Set dimensions for the SVG container
           const width = 800;
           const height = 400;
           const padding = 50;

           // Select the SVG element and set its width and height
           const svg = d3.select("#chart")
                         .attr("width", width)
                         .attr("height", height);

           // Create a time scale for the x-axis
           const xScale = d3.scaleTime()
                            .domain([d3.min(dataset, d => new Date(d[0])), d3.max(dataset, d => new Date(d[0]))])
                            .range([padding, width - padding]);

           // Create a linear scale for the y-axis
           const yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, d => d[1])])
                            .range([height - padding, padding]);

           // Generate the x-axis using the x-scale
           const xAxis = d3.axisBottom(xScale);
           // Generate the y-axis using the y-scale
           const yAxis = d3.axisLeft(yScale);

           // Append the x-axis to the SVG and set its position
           svg.append("g")
              .attr("id", "x-axis")
              .attr("transform", `translate(0, ${height - padding})`)
              .call(xAxis);

           // Append the y-axis to the SVG and set its position
           svg.append("g")
              .attr("id", "y-axis")
              .attr("transform", `translate(${padding}, 0)`)
              .call(yAxis);

           // Bind the data to rect elements and create bars
           svg.selectAll(".bar")
              .data(dataset)
              .enter()
              .append("rect")
              .attr("class", "bar")
              .attr("x", d => xScale(new Date(d[0]))) // Set x position based on the date
              .attr("y", d => yScale(d[1])) // Set y position based on GDP value
              .attr("width", (width - 2 * padding) / dataset.length) // Set bar width
              .attr("height", d => height - padding - yScale(d[1])) // Set bar height
              .attr("data-date", d => d[0]) // Set data-date attribute
              .attr("data-gdp", d => d[1]) // Set data-gdp attribute
              .on("mouseover", function(event, d) { // Add mouseover event for tooltip
                   const tooltip = d3.select("#tooltip");
                   tooltip.style("display", "block")
                          .style("left", event.pageX + 10 + "px") // Position tooltip
                          .style("top", event.pageY - 28 + "px")
                          .attr("data-date", d[0]) // Set data-date attribute for tooltip
                          .html(`Date: ${d[0]}<br>GDP: ${d[1]} Billion USD`); // Display date and GDP
              })
              .on("mouseout", function() { // Add mouseout event to hide tooltip
                   d3.select("#tooltip").style("display", "none");
              });
       })
       .catch(error => console.log(error)); // Log any errors to the console
});

// explaination
/*Explanation of Comments:
Event Listener: Waits for the DOM content to load before running the script.
Fetch Data: Fetches the GDP data from the provided URL.
Extract Data: Extracts the data array from the fetched JSON.
SVG Dimensions: Sets the dimensions of the SVG container.
Select SVG: Selects the SVG element and sets its attributes.
X-Scale: Creates a time scale for the x-axis based on the date range in the dataset.
Y-Scale: Creates a linear scale for the y-axis based on the GDP values.
X-Axis: Generates and appends the x-axis to the SVG.
Y-Axis: Generates and appends the y-axis to the SVG.
Create Bars: Binds data to rect elements, sets their attributes, and positions them accordingly.
Tooltip Events: Adds mouseover and mouseout events to display and hide the tooltip with relevant data.
*/