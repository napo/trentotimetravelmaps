var bgmap = 0;
var fgmap = 6;
var totalmaps = 1;
var configmaps;
var actualview = 1;
var views = [{
        id: 0,
        label: "Mostra una mappa",
        icon: "1.jpg"
    },
    {
        id: 1,
        label: "Lente sovrapposta",
        icon: "2.jpg"
    },
    {
        id: 2,
        label: "Mappe in parallelo",
        icon: "3.jpg"
    }
];


$.ajax({
    dataType: "json",
    url: "data/config.json",
    success: function(data) {
        configmaps = data;
        totalmaps = configmaps.length - 1;
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

var backgroundleft = L.tileLayer('https://mapwarper.net/maps/tile/19481/{z}/{x}/{y}.png ', {
    attribution: 'Pianta della città di Trento - 1915 <a href="https://commons.wikimedia.org/wiki/File:Battisti_-_Il_Trentino,_cenni_geografici,_storici,_economici,_1915_72.jpg">Wikimedia Commmons</a> '
});

var backgroundright = L.tileLayer('https://tiles.openaerialmap.org/60770b0fb85cd80007a01414/0/60770b0fb85cd80007a01415/{z}/{x}/{y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright/it">OpenStreetMap contributors</a>'
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
var center = [46.06847, 11.11925]
map.setView(center, 17);
map.zoomControl.setPosition('topright');
map.on("mousemove", function(e) {
    foreground.setCenter(e.containerPoint.x, e.containerPoint.y);
});

L.control.scale({ 'position': 'bottomright' }).addTo(map);
//L.control.measureControl().addTo(map);
/*
var sidebar = L.control.sidebar({
    container: 'sidebar'
}).addTo(map).open('list');
*/
function changeview(v) {
    if (v == 0) {
        if (actualview == 0) {
            actualview = (views.length - 1);
        } else {
            actualview = actualview - 1;
        }
    }
    if (v == 1) {
        if (actualview == (views.length - 1)) {
            actualview = 0;
        } else {
            actualview = actualview + 1;
        }
    }
    switch (actualview) {
        case 0:
            viewrules(actualview);
            break;
        case 1:
            viewrules(actualview);
            break;
        case 2:
            viewrules(actualview);
            break;
        default:
            break;
    }
}

function viewrules(rule) {
    switch (rule) {
        case 0:
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('#descview').text(views[actualview].label);
            $("#map2").hide();
            $('#map2').width = "0%";
            $('#map').width = "100%";
            map.removeLayer(foreground);
            map.removeLayer(background);
            map.addLayer(backgroundleft);
            map.zoomControl.addTo(map);
            map.removeLayer(foreground);
            break;
        case 1:
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('#descview').text(views[actualview].label);
            $("#map2").hide();
            $('#map2').width = "0%";
            $('#map').width = "100%";
            map.zoomControl.addTo(map);
            map.removeLayer(backgroundleft);
            map.addLayer(background);
            map.addLayer(foreground);
            map.on("mousemove", function(e) {
                foreground.setCenter(e.containerPoint.x, e.containerPoint.y);
            });
            break;
        case 2:
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('#descview').text(views[actualview].label);
            map.removeLayer(foreground);
            map.removeLayer(background);
            map.addLayer(backgroundleft);
            $("#map2").show();
            $('#map2').width = "50%";
            $('#map').width = "50%";
            map.zoomControl.remove();
            map.invalidateSize();
            //map2.invalidateSize();
            break;
        default:
            break;
    }
}

function changeleftmap(d) {
    if (d == 0) {
        if (fgmap == 0) {
            fgmap = (configmaps.maps.length - 1);
        } else {
            fgmap = fgmap - 1;
        }
    }
    if (d == 1) {
        if (fgmap == (configmaps.maps.length - 1)) {
            fgmap = 0;
        } else {
            fgmap = fgmap + 1;
        }
    }
    layermap = configmaps.maps[fgmap];
    $('#descfgmap').text(layermap.description)
    $('#yearfg').text(layermap.year);
    $('#imgfgmap').attr("src", layermap.image);
    switch (actualview) {
        case 0:
            map.removeLayer(foreground);
            map.removeLayer(backgroundleft);
            backgroundleft = L.tileLayer(layermap.url, {
                attribution: layermap.attribution
            });
            map.addLayer(backgroundleft);
            break;
        case 1:
            map.removeLayer(backgroundleft);
            map.addLayer(background);
            map.removeLayer(foreground);
            foreground = L.tileLayer.mask(layermap.url, {
                maskSize: 256,
                attribution: layermap.attribution
            });
            map.addLayer(foreground);
            map.addLayer(background);
            map.on("mousemove", function(e) {
                foreground.setCenter(e.containerPoint.x, e.containerPoint.y);
            });
            break;
        case 2:
            map.removeLayer(foreground);
            map.removeLayer(backgroundleft);
            backgroundleft = L.tileLayer(layermap.url, {
                attribution: layermap.attribution
            });
            map.addLayer(backgroundleft);
            break;
    }
    return (layermap);
}


function changerightmap(d) {
    if (d == 0) {
        if (bgmap == 0) {
            bgmap = configmaps.maps.length - 1;
        } else {
            bgmap = bgmap - 1;
        }
    }
    if (d == 1) {
        if (bgmap == (configmaps.maps.length - 1)) {
            bgmap = 0;
        } else {
            bgmap = bgmap + 1;
        }
    }
    layermap = configmaps.maps[bgmap];
    $('#descbgmap').text(layermap.description)
    $('#yearbg').text(layermap.year);
    $('#imgbgmap').attr("src", layermap.image);
    switch (actualview) {
        case 0:
            map.removeLayer(foreground);
            break;
        case 1:
            map.removeLayer(background);
            background = L.tileLayer(layermap.url, {
                attribution: layermap.attribution
            });
            map.addLayer(background);
            break;
        case 2:
            map.removeLayer(foreground);
    }
    return (layermap);
}


var osm = L.tileLayer('https://tile.jawg.io/{z}/{x}/{y}.png?api-key=community', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright/it">OpenStreetMap contributors</a>'
});

var map2 = L.map('map2', {
    layers: [backgroundright],
    center: center,
    zoom: 17,
    zoomControl: true
});
map2.zoomControl.setPosition('topright');
map.sync(map2);
map2.sync(map);