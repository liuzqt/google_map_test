/**
 * Created by liuziqi on 2017/11/12.
 */

var austin_centre_coordinate = {lat: 30.2699278, lng: -97.7531634};
var map;
var service;
var infowindow;
var auto1;
var auto2;
var agency_list = new Map();
var agency_marker = [];
var position_marker = [];
var default_radius=16000;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: austin_centre_coordinate,
        zoom: 13
    });
    var input1 = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input1'));
    var input2 = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input2'));
    var button = /** @type {!HTMLInputElement} */(
        document.getElementById('search-button'));

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input1);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input2);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(button);


    auto1 = new google.maps.places.Autocomplete(input1);
    auto2 = new google.maps.places.Autocomplete(input2);

    auto1.bindTo('bounds', map);
    auto2.bindTo('bounds', map);


    infowindow = new google.maps.InfoWindow();

    service = new google.maps.places.PlacesService(map);


}


function removeMarker(m) {
    m.setMap(null);
}

const asyncronized = place => new Promise((resolve, reject) => {
    service.nearbySearch({
        location: place.geometry.location,
        radius: default_radius,
        type: ['real_estate_agency']
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.map(function (a) {
                agency_list.set(a.id, a);
            });
            resolve('ok');
        } else {
            reject('err');
        }
    });
});


function search() {
    let test = $('.panel-primary');

    // clean old data
    agency_list.clear();
    agency_marker.map(removeMarker);
    agency_marker = [];
    position_marker.map(removeMarker);
    position_marker = [];


    let place1 = auto1.getPlace();
    let place2 = auto2.getPlace();
    if (!place1.geometry || !place2.geometry) {
        let wrong_place_name = place1.geometry ? place2.name : place1.name;
        window.alert("No details available for input: '" + wrong_place_name + "'");
        return;
    }


    Promise.all([asyncronized(place1), asyncronized(place2)]).then(function () {
        let agency_arr = Array.from(agency_list.values());

        let viewport = agency_arr.map(a => a.geometry.viewport).reduce(function (x, y) {
            x.b.b = Math.min(x.b.b, y.b.b);
            x.b.f = Math.max(x.b.f, y.b.f);
            x.f.b = Math.min(x.f.b, y.f.b);
            x.f.f = Math.max(x.f.f, y.f.f);
            return x;
        });

        map.fitBounds(viewport);
        let arr_dist = agency_arr.map(function (a) {
            return [a, dist(a.geometry.location, place1.geometry.location) + dist(a.geometry.location, place2.geometry.location)];
        });

        arr_dist.sort(function (x, y) {
            return x[1] - y[1];

        });
        arr_dist.map(x => createMarker(x[0]));

        let panel = $('#result_panel');
        if (panel.length === 0) {
            console.log('test');
            panel = /** @type {!HTMLInputElement} */$('<div class="panel panel-primary" id="result_panel"><div class="panel-heading"><h3 class="panel-title">Result List</h3></div><div class="panel-body"><ul class="list-group"></ul></div></div>');
        }
        let list = panel.find('ul');
        console.log(panel);
        list.empty();
        arr_dist.map(function (place) {
            console.log(place[1]);
            list.append($('<li class="list-group-item"><strong>' + place[0].name + '</strong>' + '(' + place[1].toString() + 'm)' + '</li>'))
        });

        map.controls[google.maps.ControlPosition.LEFT_CENTER].push(panel[0]);


    });

    setFlagMarkers(map, place1.geometry.location);
    setFlagMarkers(map, place2.geometry.location);


}


function dist(x, y) {
    var km = 6371. * Math.PI * Math.sqrt(Math.pow(x.lat() - y.lat(), 2) + Math.pow(x.lng() - y.lng(), 2)) / 360;
    return Math.round(km * 100) * 10;
}


function createMarker(place) {
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
        title: 'Agency'
    });
    agency_marker.push(marker);
    addHoverInfo(marker, place.name);
}

function setFlagMarkers(map, location) {

    let image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };

    let shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };

    let marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: image,
        shape: shape,
    });
    addHoverInfo(marker, 'you');
    position_marker.push(marker);
}


function addHoverInfo(marker, msg) {
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.close();
        infowindow.setContent("<div id='infowindow'>" + msg + "</div>");
        infowindow.open(map, marker);
    });
}