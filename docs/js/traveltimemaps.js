var rightmapid = 0;
var leftmapid = 6;
var totalmaps = 1;
var configmaps;
var actualview = 0;
var views = [{
        id: 0,
        label: "Lente sovrapposta",
        icon: "1.jpg"
    },
    {
        id: 1,
        label: "Mappa singola",
        icon: "3.jpg"
    },
    {
        id: 2,
        label: "Mappe in parallelo",
        icon: "2.jpg"
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
    console.log(actualview);
    console.log(views[actualview].label);
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
        // Mappa singola
        case 1:
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            $("#map2").hide();
            $('#map2').width = "0%";
            $('#map').width = "100%";
            map.removeLayer(foreground);
            map.removeLayer(background);
            map.addLayer(backgroundleft);
            map.zoomControl.addTo(map);
            map.removeLayer(foreground);
            break;
            // Lente
        case 0:
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            $("#map2").hide();
            $('#map2').width = "0%";
            $('#map').width = "100%";
            map.zoomControl.addTo(map);
            map.removeLayer(backgroundleft);
            map.addLayer(background);
            map.addLayer(foreground);
            layermap = configmaps.maps[rightmapid];
            foreground = L.tileLayer.mask(layermap.url, {
                attribution: layermap.attribution
            });
            map.on("mousemove", function(e) {
                foreground.setCenter(e.containerPoint.x, e.containerPoint.y);
            });
            break;
            // doppia
        case 2:
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            map.removeLayer(foreground);
            map.removeLayer(background);
            map.addLayer(backgroundleft);
            $("#map2").show();
            $('#map2').width = "50%";
            $('#map').width = "50%";
            map.zoomControl.remove();
            map.invalidateSize();
            changeWindowSize();
            //map2.invalidateSize();
            break;
        default:
            break;
    }
}

function changeleftmap(d) {
    if (d == 0) {
        if (leftmapid == 0) {
            leftmapid = (configmaps.maps.length - 1);
        } else {
            leftmapid = leftmapid - 1;
        }
    }
    if (d == 1) {
        if (leftmapid == (configmaps.maps.length - 1)) {
            leftmapid = 0;
        } else {
            leftmapid = leftmapid + 1;
        }
    }
    console.log(d);
    layermap = configmaps.maps[leftmapid];
    $('#descmapleft').text(layermap.description)
    $('#yearleaft').text(layermap.year);
    $('#imgleftmap').attr("src", layermap.image);
    switch (actualview) {
        case 1:
            map.removeLayer(foreground);
            map.removeLayer(backgroundleft);
            backgroundleft = L.tileLayer(layermap.url, {
                attribution: layermap.attribution
            });
            map.addLayer(backgroundleft);
            break;
        case 0:
            map.removeLayer(backgroundleft);
            map.addLayer(background);
            map.removeLayer(foreground);
            foreground = L.tileLayer.mask(layermap.url, {
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
}

function changeWindowSize() {
    h = $(window).height();
    w = $(window).width();
    window.resizeTo(w - 30, h - 50);
    window.resizeTo(w, h);
}

function changerightmap(d) {
    if (d == 0) {
        if (rightmapid == 0) {
            rightmapid = configmaps.maps.length - 1;
        } else {
            rightmapid = rightmapid - 1;
        }
    }
    if (d == 1) {
        if (rightmapid == (configmaps.maps.length - 1)) {
            rightmapid = 0;
        } else {
            rightmapid = rightmapid + 1;
        }
    }
    layermap = configmaps.maps[rightmapid];
    $('#descrightmap').text(layermap.description)
    $('#yearright').text(layermap.year);
    $('#imgrightmap').attr("src", layermap.image);
    switch (actualview) {
        case 1:
            map.removeLayer(foreground);
            break;
        case 0:
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


var map2 = L.map('map2', {
    layers: [backgroundright],
    center: center,
    zoom: 17,
    zoomControl: true
});
map2.zoomControl.setPosition('topright');
map.sync(map2);
map2.sync(map);