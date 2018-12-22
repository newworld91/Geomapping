
//API query to get the data
var query1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var query2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
function markerSize(magnitude) {
    return magnitude * 4;
};


var earthquakes = new L.LayerGroup();

d3.json(query1, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});




function Color(magnitude) {
    if (magnitude > 5) {
        return '#ff5c33'
    } else if (magnitude > 4) {
        return '#ff9966'
    } else if (magnitude > 3) {
        return '#ffb366'
    } else if (magnitude > 2) {
        return '#ffcc00'
    } else if (magnitude > 1) {
        return '#d5ff80'
    } else {
        return '#99ff33'
    }
};

function createMap() {

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibmV3d29ybGQ5MSIsImEiOiJjanBsZHdpNjEwZDNhNDJrOWNjazAzOGlvIn0.JcouwcDct8HY9MvWoMNoOQ'
    });



    var baseLayers = {
        "Street": streetMap,
    };

    var overlays = {
        "Earthquakes": earthquakes,

    };

    var mymap = L.map('mymap', {
        center: [40, -99],
        zoom: 4.3,

        layers: [streetMap, earthquakes]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);

    
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}

// createMap()