var bgmap = 0;
var fgmap = 6;
var totalmaps = 1;
var config;
$.ajax({
    dataType: "json",
    url: "data/config.json",
    success: function(data) {
        config = data;
        totalmaps = config.length - 1;
    },
    error: function() {
        console.log("errore caricamento json");
    }
})


var background = L.tileLayer('https://tiles.openaerialmap.org/60770b0fb85cd80007a01414/0/60770b0fb85cd80007a01415/{z}/{x}/{y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright/it">OpenStreetMap contributors</a>'
});

var foreground = L.tileLayer.mask('https://mapwarper.net/maps/tile/19481/{z}/{x}/{y}.png ', {
    maskSize: 256,
    attribution: 'Pianta della città di Trento - 1915 <a href="https://commons.wikimedia.org/wiki/File:Battisti_-_Il_Trentino,_cenni_geografici,_storici,_economici,_1915_72.jpg">Wikimedia Commmons</a> '
});

// standard leaflet map setup
var map = L.map('map', {
    maxZoom: 18,
    minZoom: 9,
    maxBound: [
        [
            [46.05858084649358, 11.102843284606934],
            [46.07879771278557, 11.1436128616333]
        ]
    ],
    inertia: false,
    layers: [background, foreground],
    zoomControl: true
});

map.setView([46.06847, 11.11925], 17);
map.zoomControl.setPosition('topright');
map.on("mousemove", function(e) {
    foreground.setCenter(e.containerPoint.x, e.containerPoint.y);
});

L.control.scale({ 'position': 'bottomright' }).addTo(map);
//L.control.measureControl().addTo(map);
var sidebar = L.control.sidebar({
    container: 'sidebar'
}).addTo(map).open('list');

function backgroundmap(d) {
    if (d == 0) {
        if (bgmap == 0) {
            bgmap = config.maps.length - 1;
        } else {
            bgmap = bgmap - 1;
        }
    }
    if (d == 1) {
        if (bgmap == (config.maps.length - 1)) {
            bgmap = 0;
        } else {
            bgmap = bgmap + 1;
        }
    }
    layermap = config.maps[bgmap];
    $('#descbgmap').text(layermap.description)
    $('#yearbg').text(layermap.year);
    map.removeLayer(background);
    background = L.tileLayer(layermap.url, {
        attribution: layermap.attribution
    });
    map.addLayer(background);
    return (layermap);
}

function foregroundmap(d) {
    if (d == 0) {
        if (fgmap == 0) {
            fgmap = (config.maps.length - 1);
        } else {
            fgmap = fgmap - 1;
        }
    }
    if (d == 1) {
        if (fgmap == (config.maps.length - 1)) {
            fgmap = 0;
        } else {
            fgmap = fgmap + 1;
        }
    }
    layermap = config.maps[fgmap];
    $('#descfgmap').text(layermap.description)
    $('#yearfg').text(layermap.year);
    map.removeLayer(foreground)
    foreground = L.tileLayer.mask(layermap.url, {
        maskSize: 256,
        attribution: layermap.attribution
    });
    map.addLayer(foreground);
    return (layermap);
}
