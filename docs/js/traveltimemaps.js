/* sidabar management */
$(document).ready(function() {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function() {
        $('#sidebar').removeClass('active');
        // $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').addClass('active');
        //$('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});

/* maps management */
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
        alert("errore caricamento configurazione");
    }
})

var background = L.tileLayer('https://tiles.openaerialmap.org/60770b0fb85cd80007a01414/0/60770b0fb85cd80007a01415/{z}/{x}/{y}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright/it">OpenStreetMap contributors</a>'
});

var foreground = L.tileLayer.mask('https://mapwarper.net/maps/tile/19481/{z}/{x}/{y}.png ', {
    maskSize: 256,
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
        //Lente
        case 0:
            $("#rightmaparea").show();
            $('#titleleftmap').text("Mappa 1");
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            $("#map2").hide();
            $('#map2').width = "0%";
            $('#map').width = "100%";
            map.removeLayer(background);
            map.removeLayer(foreground);
            map.addLayer(background);
            map.addLayer(foreground);
            map.zoomControl.addTo(map);
            break;
            // Mappa singola
        case 1:
            $('#titleleftmap').text("Mappa");
            $("#rightmaparea").hide();
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            $("#map2").hide();
            $('#map2').width = "0%";
            $('#map').width = "100%";
            map.removeLayer(background);
            map.removeLayer(foreground);
            map.addLayer(background);
            map.addLayer(foreground);
            map.zoomControl.addTo(map);
            break;
            // Doppia
        case 2:
            $('#titleleftmap').text("Mappa 1");
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            $("#rightmaparea").show();
            map.removeLayer(foreground);
            map.removeLayer(background);
            map2.removeLayer(backgroundright);
            map.addLayer(foreground);
            map.addLayer(background);
            map2.addLayer(backgroundright);
            $("#map2").show();
            $('#map2').width = "50%";
            $('#map').width = "50%";
            map.zoomControl.remove();
            $("#map2").animate({ width: '50%' }, 400);
            setTimeout(function() { map2.invalidateSize() }, 400);
            break;
        default:
            break;
    }
}

function getmapid(x, y, maxsize, action) {
    if (action == 1) {
        x = x + 1;
        if (x == y) {
            x = x + 2;
        }
        if (x > maxsize) {
            x = 0;
            if (x == y) {
                x = 1;
            }
        }
    }
    if (action == 0) {
        x = x - 1;
        if (x == y) {
            x = x - 2;
        }
        if (x < 0) {
            x = maxsize;
            if (x == y) {
                x = 0;
            }
        }
    }
    return (x);
}

function changeLayers(v, lmap, lmap2) {
    map.removeLayer(background);
    map.removeLayer(foreground);
    map.removeLayer(backgroundright);
    switch (v) {
        case 0:

            foreground = L.tileLayer.mask(lmap.url, {
                maskSize: 256,
                attribution: lmap.attribution
            });
            layermapb = configmaps.maps[rightmapid];
            background = L.tileLayer(lmap2.url, {
                attribution: lmap2.label
            });
            viewrules(0);
            break;
        case 1:
            foreground = L.tileLayer.mask(lmap.url, {
                maskSize: 256,
                attribution: lmap.attribution
            });
            background = L.tileLayer(lmap.url, {
                attribution: lmap.attribution
            });
            viewrules(1);
            break;
        case 2:
            foreground = L.tileLayer.mask(lmap.url, {
                maskSize: 256,
                attribution: lmap.attribution
            });
            background = L.tileLayer(lmap.url, {
                attribution: lmap.label
            });
            backgroundright = L.tileLayer(lmap2.url, {
                attribution: lmap2.label
            });
            viewrules(2);
            break;
    }
}

function changeleftmap(d) {
    maxsize = configmaps.maps.length - 1;
    leftmapid = getmapid(leftmapid, rightmapid, maxsize, d);
    layermap = configmaps.maps[leftmapid];
    layermapr = configmaps.maps[rightmapid];
    $('#descmapleft').text(layermap.description)
    $('#yearleaft').text(layermap.year);
    $('#imgleftmap').attr("src", layermap.image);
    changeLayers(actualview, layermap, layermapr);
}


function changerightmap(d) {
    maxsize = configmaps.maps.length - 1;
    rightmapid = getmapid(rightmapid, leftmapid, maxsize - 1, d);
    layermap = configmaps.maps[rightmapid];
    layermapr = configmaps.maps[leftmapid];
    $('#descmapright').text(layermap.description)
    $('#yearright').text(layermap.year);
    $('#imgrightmap').attr("src", layermap.image);
    changeLayers(actualview, layermapr, layermap);
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