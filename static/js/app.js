// declare global data variable to only fetch source data once 
let data; 

//set the url location 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//fetch data and store in global variable
d3.json(url).then(bellyData => {
    data = bellyData;
    console.log("Data loaded:", data);

    // Populate the dropdown menu
    let dropdown = d3.select("#selDataset");
    let names = data.names;

   // Loop through each ID in the names array and append as options in the dropdown menu
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });
    console.log("Dropdown populated");
  
    // Initialise the dashboard with the first sample/ID
    updateDashboard(data, names[0]);
});

// Function to update all the dashboard elements
function updateDashboard(data, newSample) {
    let samples = data.samples;
    let sample = samples.filter(obj => obj.id === newSample)[0];
    console.log("Filtered sample:", sample);
  
    // For bar chart
    let sample_values = sample.sample_values.slice(0, 10).reverse();
    let otu_ids = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let otu_labels = sample.otu_labels.slice(0, 10).reverse();
  
    let trace1 = {
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    };
  
    let barData = [trace1];
    
    Plotly.newPlot("bar", barData);
  
    // For bubble chart
    let bubbleTrace = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: "markers",
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      }
    };
  
    let bubbleData = [bubbleTrace];
    
    Plotly.newPlot("bubble", bubbleData);

    // For metadata
    let metadata = data.metadata.filter(obj => obj.id == newSample)[0];
    let demoInfo = d3.select("#sample-metadata");
  
    demoInfo.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      demoInfo.append("h5").text(`${key}: ${value}`);
    });
}

// Function to update the dashboard when a new sample is selected
function optionChanged(newSample) {
    updateDashboard(data, newSample);
  }
  