const query_url= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

const chooseColor = (depth) => {
    if (depth > 110) {
        return "purple";
    } else if (depth > 90 && depth <= 110) {
        return "red";
    } else if (depth > 70 && depth <= 90) {
        return "darkorange";
    } else if (depth > 50 && depth <= 70) {
        return "orange";
    } else if (depth > 30 && depth <= 50) {
        return "yellow";
    } else if (depth > 10 && depth <= 30) {
        return "lightyellow";
    } else {depth <= 10
        return "lightgreen";
    }
};

// Perform a GET request to the query URL/
d3.json(query_url).then(function(data) {
    createFeatures(data.features)
});   

function createFeatures(earthquakeData) {

        // Define a function that we want to run once for each feature in the features array.
        // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${feature.properties.mag}<br>${new Date(feature.properties.time)}</p>`);
    }
        // Create a GeoJSON layer that contains the features array on the earthquakeData object.
        // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes= L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, location) {
            let mapMarkers= {
                fillOpacity: 0.75,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: chooseColor(feature.geometry.coordinates[2]),
                radius: feature.properties.mag * 5,
                stroke: false
                }
                return L.circleMarker(location, mapMarkers);

            }
        });
    
        // Send our earthquakes layer to the createMap function/
        createMap(earthquakes);

};    

function createMap(earthquakes) {        
    // Create a Leaflet map centered on the United States (Creating the map object)
    let myMap = L.map("map", {
        center: [39.6, -94.4],
        zoom: 3.5
    });

    // Create the base layers.
    let regular = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let baseMaps = {
        "Regular Map": regular,
        "Terrain Map": topo
    };

    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    //Create the legend
    let info = L.control({
        position: "bottomright"
     });
  
    // When the layer control is added, insert a div with the class of "info".
    info.onAdd = function() {
        let div = L.DomUtil.create("div", "legend");
        let colors= ["purple", "red", "darkorange", "orange", "yellow", "lightyellow", "lightgreen"];
        let legenddepths= ['depth > 110', 'depth 90 to 110', 'depth 70 to 90', 'depth 50 to 70', 'depth 30 to 50', 'depth 10 to 30', 'depth < 10'];

        for (i = 0; i < legenddepths.length; i++) {
            div.innerHTML += '<li style="background: ' + colors[i] +'"</li>' + legenddepths[i] + '<br>';
            } 
            
        return div;
    
    };info.addTo(myMap);
};