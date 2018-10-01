console.log("JS Conectado");
var map, marker
var cantidad_spots;
miStorage = window.localStorage;
var usuario = JSON.parse(miStorage.user)

var markers = [];
var contentString = [];

var test = ["Jonathan","Fernando","Bruno"];

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 19.391003, lng: -99.284041},
  zoom: 5
});

marker = new google.maps.Marker;
var infowindow =  new google.maps.InfoWindow();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    $.post( "/contarSpots", function(result) {
      cantidad_spots = result.contador;
      spots = result.spots.d.results;

      console.log("Cantidad de marcadores a agregar: " + cantidad_spots);

      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var image = {
          url: "circulo_Verde3.png",
          scaledSize: new google.maps.Size(30, 30)
        };

      console.log(pos);

      marker.setPosition(pos);
      marker.setMap(map);
      map.setCenter(pos);
      map.setZoom(16);

      for(i=0;i<cantidad_spots;i++){
        console.log("agregando nuevo marcador");

        rand1 = Math.random() * (.008 - .001) + .001;
        rand2 = Math.random() * (.008 - .001) + .001;

        var pos2 = {
          lat: Number(position.coords.latitude) + (rand1),
          lng: Number(position.coords.longitude) + (rand2)
        };

        console.log(pos2);

        markers[i] = new google.maps.Marker({
          position: pos2,
          map: map,
          icon:image,
          id_marker: spots[i].ID_SPOT,
          direccion: spots[i].DIRECCION
        });

      };

      for(x=0;x<markers.length;x++){
        google.maps.event.addListener(markers[x], 'click', function() {
          var marcador = this;
          console.log(marcador);
          infowindow.setContent(infoMensaje(this));
          infowindow.open(map, this);
          // Agregando información al modal 
          $("#botonReservar").click(function () {
            $("#tituloModal").text(marcador.direccion);
          });

          $("#botonConfirmarReserva").click(function(){
              // Hacer un post a la tabla de hana para guardar la reserva, pasando ID de lugar, fecha y hora.
              var info = {
               "ID_SPOT": marcador.id_marker,
               "ID_USUARIO_RESERVA": usuario.ID_USUARIO,
               "FECHA_INICIO": $("#fecha_inicio").val(),
               "FECHA_FIN": $("#fecha_fin").val(),
               "HORA_INICIO": $("#hora_inicio").val(),
               "HORA_FIN": $("#hora_fin").val()
               };

               var mensaje = ""; 

              $.post( "/crearReserva",info,function(result) {
                resultado = result.resultado;
                console.log(result.resultado);
                console.log(result.id_reserva);
                if (resultado == "success"){
                  mensaje = "Tu reserva se realizó de manera exitosa. <p> El id de tu reserva es: " + result.id_reserva + "</p>"
                } else {
                  mensaje = "Hubo un error en tu reservación. Inténtalo de nuevo más tarde."
                }
                console.log("Se realizó el post satisfactoriamente.");
                $("#exampleModal").modal('hide');
                $("#MensajeModalConfirmacion").html(mensaje);
                $("#modalConfirmacion").modal('show');
              });
          });
        });
      };

      console.log("Proceso de carga de mapa terminado");
  		})},
	)}
};


function infoMensaje(marker){
  var mensaje = ""
  var rand = Math.floor((Math.random() * (2 - 0) + 0));
  array = ["Fernando", "Jonathan", "Bruno"];
  mensaje = array[rand];

  mensaje = '<div class="text-center" id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h2 id="firstHeading" class="firstHeading">'+marker.direccion+'</h2>'+
          '<div id="bodyContent">'+
          '<p><b>Status:</b> Available</p>'+
          '<p><b>Owner:</b> Jonathan Aguilar</p>'+
          '<p><b>Cost per hour:</b> $2</p>'+
          '<p><b>Time to get there:</b> 3 min</p>'+
          '<p><button class="btn btn-lg btn-primary btn-block" data-toggle="modal" data-target="#exampleModal" id="botonReservar">Reserve Spot!</button></p>'+
          // '<p>id_spot: '+ marker.id_marker + '</p>'+
          '</div></div>'
          ;
  return mensaje;
};
