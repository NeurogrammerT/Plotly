function buildMetadata(sample) {
  // Using `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function (metaData) {
    console.log(metaData);

    // Using d3 to select the panel with id of `#sample-metadata`
    // Using `.html("") to clear any existing metadata
    var sampleData = d3.select("#sample-metadata").html("");

    // Using `Object.entries` to add each key and value pair to the panel
    // Using d3 to append new tags for each key-value in the metadata.
    Object.entries(metaData).forEach(([key, value]) => {
      sampleData.append('h6').text(`${key}, ${value}`);
      console.log(sampleData);
    });
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);     
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function (sampleData) {
    console.log(sampleData);

    // Create Variables for Plots
    const otu_ids = sampleData['otu_ids'];
    const sample_values = sampleData['sample_values'];
    const otu_labels = sampleData['otu_labels'];

    console.log(otu_ids);
    console.log(sample_values);
    console.log(otu_labels);

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleTrace = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    }];

    var bubbleLayout = {
      xaxis: { title: 'OTU ID' },
      showlegend: false,
    };

    Plotly.plot('bubble', bubbleTrace, bubbleLayout);

    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieTrace = [{
      labels: otu_ids.slice(0, 10),
      values: sample_values.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var pieLayout = {
      margin: { t: 0, l: 0 },
    };

    Plotly.plot("pie", pieTrace, pieLayout);
  });
}

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
