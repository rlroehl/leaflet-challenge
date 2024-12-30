function createMap(quakes) {

    // Create the tile layer that will be the background of our map.
    let worldmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Create a baseMaps object to hold the world map layer.
    let baseMaps = {
      "World Map": worldmap
    };
  
    // Create an overlayMaps object to hold the quakes layer.
    let overlayMaps = {
      "Earthquakes": quakes
    };
  
    // Create the map object with options.
    let map = L.map("map1", {
      center: [60, 60],
      zoom: 2,
      layers: [worldmap, quakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }

  function createMarkers(response) {
  
    // Pull the "quakeData" property from response.data.
    let quakeData = response.features;

    // Find values for depth colors
    let quakeDepths = quakeData.map(quake => quake.geometry.coordinates[2]);
    let maxQuakeDepth = Math.max(...quakeDepths);
    let dHigh = maxQuakeDepth * .66;
    let dLow = maxQuakeDepth * .33;

    // Initialize an array to hold the quake markers and depths.
    let quakeMarkers = [];

    // Loop through the quakeData array.
    for (let index = 0; index < quakeData.length; index++) {
      let quake = quakeData[index];

      let quakeDepth = quake.geometry.coordinates[2];
      let depthColor;
    
      // Determine the marker color based on depth
      if (quakeDepth > dHigh) {
        depthColor = 'green';
      } else if (quakeDepth > dLow) {
        depthColor = 'yellow';
      } else {
        depthColor = 'red'; 
      }

      // For each quake: create a marker, and bind a popup with relevant data.
      let quakeMarker = L.circle(
        [quake.geometry.coordinates[1], 
        quake.geometry.coordinates[0]],{
          radius: quake.properties.mag,
          color: depthColor,
          fillOpacity: 0.5
        })
      .bindPopup(
        "<h3>Location: " + quake.properties.place + "</h3>" +
        "<h3>Date: " + Date(quake.properties.time) + "</h3>" +
        "<h3>Magnitude: " + quake.properties.mag + "</h3>" +
        "<h3>Depth: " + quake.geometry.coordinates[2] + " kilometers</h3>"
      );

      // Add the marker to the quakeMarkers array.
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group that's made from the quake markers array, and pass it to the createMap function.
    createMap(L.layerGroup(quakeMarkers));
  }

  
// Perform an API call to the earthquake.usgs geojson. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);