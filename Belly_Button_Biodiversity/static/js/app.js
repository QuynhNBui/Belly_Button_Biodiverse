function buildMetadata(sample) {


  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => { 
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    })

    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    //Build a bubble chart using sample data
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;

    let bubbleLayout = {
      margin: {b:0, l:30},
      hovermode: "closests",
      xaxis: {title: "OTU ID"},
      title: sample + "'s OTU  Volume & Spread",
      showLegend: false
    }

    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        hoverinfo: "x + y + text",
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    let pieData = [
    {
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      //marker: {colors:['rgba(10, 84, 0, .5)', 'rgba(12, 97, 0, .5)', 
                                //'rgba(13, 113, 0, .5)', 'rgba(14, 127, 0, .5)', 
                                //'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)', 
                                //'rgba(202, 209, 95, .5)', 'rgba(210, 206, 145, .5)', 
                                //'rgba(232, 226, 202, .5)', 'rgba(245, 240, 222, .5)']},
      marker: {colorscale:"Viridis"},
      hole: 0.3,
      type:"pie",
      textinfo: 'percent',
      hovertext: otu_ids.slice(0,10),
      hoverinfo: 'hovertext + value'
    }
  ];

    let pieLayout = {
    title: sample + "'s Top OTU Microbiomes",
    margin: {t:30, l:10}
  };

  Plotly.newPlot("pie", pieData, pieLayout);
})
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
