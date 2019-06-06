function buildMetadata(sample) {
  selected = d3.select("#selDataset").node().value;
  // @TODO: Complete the following function that builds the metadata panel

  d3.json(`/metadata/${selected}`).then((metadata) =>
    d3.select('#sample-metadata')
      .html('')
      .html(Object.entries(metadata)
    )
  );
};


// Use `d3.json` to fetch the metadata for a sample
// Use d3 to select the panel with id of `#sample-metadata`
// Use `.html("") to clear any existing metadata
// Use `Object.entries` to add each key and value pair to the panel
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.


// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);

function buildCharts(sample) {
  selected = d3.select("#selDataset").node().value;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${selected}`).then((sampleData) => {
    var bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      }
    };
    var bubbleData = [bubbleTrace];
    var bubbleLayout = {
      title: 'Bubble Title',
      showlegend: false,
      height: 500,
      width: 1000
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    var pieData = [{
      values: sampleData.sample_values.slice(1,10),
      labels: sampleData.otu_ids.slice(1,10),
      type: 'pie'
    }];
    var pieLayout = {
      height: 500,
      width: 500
    };
  Plotly.newPlot('pie', pieData, pieLayout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
