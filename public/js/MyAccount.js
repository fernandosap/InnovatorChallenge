console.log("JS Conectado");
miStorage = window.localStorage;
var usuario = JSON.parse(miStorage.user)
var reservas = [];

$("#NombreUsuario").text(usuario.NOMBRE + " " + usuario.APELLIDO);
$("#CorreoUsuario").text(usuario.EMAIL);

$.post("/obtenerImagenesUsuario",{id_usuario:usuario.ID_USUARIO}, function(result) {
      $("#ImagenUsuario").attr('src',result.foto1);
});

$.post("/consultarReservas",{id_usuario:usuario.ID_USUARIO},function(result){
      reservas = result.reservas;
      for(i=0; i<=reservas.length ;i++){
        $("#tabla_reservas").append('<tr><th scope="row">' + reservas[i].ID_RESERVA + '</th><td>' + reservas[i].UBICACION_DESC + '</td><td>' + reservas[i].FECHA_INICIO + '</td><td>' + reservas[i].FECHA_FIN + '</td><td> ' + reservas[i].HORA_INICIO + '</td><td> ' + reservas[i].HORA_FIN + '</td><td>$' + Math.floor(Math.random()*100) + '</td><td>' + reservas[i].PLACA + '</td><td>' + reservas[i].ESTATUS + '</td><td><p><a class="btn btn-danger" target="_blank" href="#"" role="button">Delete</a></td></tr>');
      }
});

$.post("/consultarReservas",{id_usuario:usuario.ID_USUARIO},function(result){
      reservas = result.spots;
      for(i=0; i<=reservas.length ;i++){
        $("#tabla_reservas").append('<tr><th scope="row">' + reservas[i].ID_RESERVA + '</th><td>' + reservas[i].UBICACION_DESC + '</td><td>' + reservas[i].FECHA_INICIO + '</td><td>' + reservas[i].FECHA_FIN + '</td><td> ' + reservas[i].HORA_INICIO + '</td><td> ' + reservas[i].HORA_FIN + '</td><td>$' + Math.floor(Math.random()*100) + '</td><td>' + reservas[i].PLACA + '</td><td>' + reservas[i].ESTATUS + '</td><td><p><a class="btn btn-danger" target="_blank" href="#"" role="button">Delete</a></td></tr>');
      }
});

