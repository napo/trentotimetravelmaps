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
var first = true;
var views = [{
        id: 0,
        label: "Lente sovrapposta",
        icon: "1.gif"
    },
    {
        id: 1,
        label: "Mappa singola",
        icon: "2.gif"
    },
    {
        id: 2,
        label: 'Mappe sovrapposte',
        icon: '3.gif'
    },
    {
        id: 3,
        label: "Mappe in parallelo",
        icon: "4.gif"
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

var foregroundleft = L.tileLayer('https://mapwarper.net/maps/tile/19481/{z}/{x}/{y}.png ', {
    attribution: 'Pianta della città di Trento - 1915 <a href="https://commons.wikimedia.org/wiki/File:Battisti_-_Il_Trentino,_cenni_geografici,_storici,_economici,_1915_72.jpg">Wikimedia Commmons</a> '
});

var sidebyside = L.control.sideBySide(background, foregroundleft);

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
            if (foreground._url == background._url) {
                foreground = L.tileLayer.mask(foreground._url, {
                    maskSize: 256,
                    attribution: foreground.options.attribution
                });
                background = L.tileLayer(backgroundright._url, {
                    attribution: backgroundright.options.attribution
                });
            }
            viewrules(actualview);
            break;
        case 1:
            if (foreground._url != background._url) {
                map.removeLayer(background);
                foregroundleft = L.tileLayer(background._url, {
                    attribution: background.options.attribution
                });
                background = L.tileLayer(foreground._url, {
                    attribution: foreground.options.attribution
                });
                map.addLayer(background);
            }
            viewrules(actualview);
            break;
        case 2:
            if (foregroundleft._url == background._url) {
                foreground = L.tileLayer.mask(foreground._url, {
                    maskSize: 256,
                    attribution: foreground.options.attribution
                });
                background = L.tileLayer(backgroundright._url, {
                    attribution: backgroundright.options.attribution
                });
                foregroundleft = L.tileLayer(foreground._url, {
                    maskSize: 256,
                    attribution: foreground.options.attribution
                });
            }
            viewrules(actualview);
            break;
        case 3:
            if (foreground._url != background._url) {
                map.removeLayer(background);
                background = L.tileLayer(foreground._url, {
                    attribution: foreground.options.attribution
                });
                map.addLayer(background);
            }
            viewrules(actualview);
            break;
        default:
            break;
    }
}

function viewrules(rule) {
    sidebyside.remove();
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
            map.eachLayer(function(layer) {
                map.removeLayer(layer);
            });
            map.addLayer(background);
            map.addLayer(foreground);
            map.zoomControl.addTo(map);
            $("#map").animate({ width: '100%' }, 400);
            setTimeout(function() { map.invalidateSize(); }, 400);
            sidebyside.remove();
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
            map.eachLayer(function(layer) {
                map.removeLayer(layer);
            });
            map.addLayer(background);
            map.addLayer(foreground);
            map.zoomControl.addTo(map);
            $("#map").animate({ width: '100%' }, 200);
            setTimeout(function() { map.invalidateSize(); }, 200);
            break;
            // mappe sorapposte
        case 2:
            $('#titleleftmap').text("Mappa 1");
            $("#rightmaparea").show();
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            $("#map2").hide();
            $('#map2').width = "0%";
            $('#map').width = "100%";
            map.eachLayer(function(layer) {
                map.removeLayer(layer);
            });
            map.addLayer(foregroundleft);
            map.addLayer(background);
            map.zoomControl.addTo(map);
            $("#map").animate({ width: '100%' }, 10);
            setTimeout(function() { map.invalidateSize(); }, 10);
            if (foreground._url != foregroundleft._url) {
                sidebyside = L.control.sideBySide(background, foregroundleft);
            } else {
                sidebyside = L.control.sideBySide(foregroundleft, background);
            }
            sidebyside.addTo(map);
            break;
            // Doppia
        case 3:
            $("#rightmaparea").show();
            $('#titleleftmap').text("Mappa 1");
            $('#selectview').attr("src", "images/" + views[actualview].icon);
            $('.descview').text(views[actualview].label);
            map.eachLayer(function(layer) {
                map.removeLayer(layer);
            });
            map2.eachLayer(function(layer) {
                map2.removeLayer(layer);
            });
            map.addLayer(foreground);
            map.addLayer(background);
            map2.addLayer(backgroundright);
            $("#map2").show();
            $('#map2').width = "50%";
            $('#map').width = "50%";
            map.zoomControl.remove();
            $("#map2").animate({ width: '50%' }, 200);
            setTimeout(function() { map2.invalidateSize(); }, 200);
            sidebyside.remove();
            break;
        default:
            break;
    }
}

function changeLayers(v, lmap, lmap2) {
    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });
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
            foregroundleft = L.tileLayer(lmap.url, {
                attribution: lmap.attribution
            });
            backgroundright = L.tileLayer(lmap2.url, {
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
            backgroundright = L.tileLayer(lmap2.url, {
                attribution: lmap2.label
            });
            viewrules(1);
            break;
        case 2:
            foreground = L.tileLayer(lmap.url, {
                attribution: lmap.attribution
            });
            background = L.tileLayer(lmap2.url, {
                attribution: lmap2.attribution
            });
            foregroundleft = L.tileLayer(lmap.url, {
                attribution: lmap.attribution
            });
            backgroundright = L.tileLayer(lmap2.url, {
                attribution: lmap2.label
            });
            viewrules(2);
            break;
        case 3:
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
            foregroundleft = L.tileLayer(lmap.url, {
                attribution: lmap.attribution
            });
            viewrules(3);
            break;
    }
}

function changeleftmap(d) {
    maxsize = configmaps.maps.length - 1;
    leftmapid = getmapid(leftmapid, rightmapid, maxsize, d);
    layermap = configmaps.maps[leftmapid];
    layermapr = configmaps.maps[rightmapid];
    $('#descmapleft').text(layermap.description);
    $('#yearleaft').text(layermap.year);
    $('#imgleftmap').attr("src", layermap.image);
    changeLayers(actualview, layermap, layermapr);
}


function changerightmap(d) {
    maxsize = configmaps.maps.length - 1;
    rightmapid = getmapid(rightmapid, leftmapid, maxsize - 1, d);
    layermap = configmaps.maps[rightmapid];
    layermapr = configmaps.maps[leftmapid];
    $('#descmapright').text(layermap.description);
    $('#yearright').text(layermap.year);
    $('#imgrightmap').attr("src", layermap.image);
    changeLayers(actualview, layermapr, layermap);
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

var map2 = L.map('map2', {
    layers: [backgroundright],
    center: center,
    zoom: 17,
    zoomControl: true
});
map2.zoomControl.setPosition('topright');
map.sync(map2);
map2.sync(map);
scale = L.control.scale({ 'position': 'bottomright' }).addTo(map);