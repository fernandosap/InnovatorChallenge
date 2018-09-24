console.log("JS Conectado");
var map, marker;
miStorage = window.localStorage;

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 19.391003, lng: -99.284041},
  zoom: 5
});

marker = new google.maps.Marker;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    console.log(pos);

    marker.setPosition(pos);
    marker.setMap(map);
    map.setCenter(pos);
    map.setZoom(16);
  		},
	)}
};

