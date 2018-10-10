console.log("JS Conectado");
miStorage = window.localStorage;
var usuario = JSON.parse(miStorage.user)
var reservas = [];
var reservas2 = [];
var spots = [];

$("#NombreUsuario").text(usuario.NOMBRE + " " + usuario.APELLIDO);
$("#CorreoUsuario").text(usuario.EMAIL);

$.post("/obtenerImagenesUsuario",{id_usuario:usuario.ID_USUARIO}, function(result) {
      $("#ImagenUsuario").attr('src',result.foto1);
});

$.post("/consultarReservas",{id_usuario:usuario.ID_USUARIO},function(result){
      reservas = result.reservas;
      console.log(reservas);
      if(reservas.length>0){
      for(i=0; i < reservas.length ;i++){
        $("#tabla_reservas").append('<tr><th scope="row">' + reservas[i].ID_RESERVA + '</th><td>' + reservas[i].UBICACION_DESC + '</td><td>' + reservas[i].FECHA_INICIO + '</td><td>' + reservas[i].FECHA_FIN + '</td><td> ' + reservas[i].HORA_INICIO + '</td><td> ' + reservas[i].HORA_FIN + '</td><td>$' + Math.floor(Math.random()*100) + '</td><td>' + reservas[i].PLACA + '</td><td>' + reservas[i].ESTATUS + '</td><td><p><a class="btn btn-danger" target="_blank" href="#"" role="button">Delete</a></td></tr>');
      }
    }
});

$.post("/consultarSpots",{id_usuario:usuario.ID_USUARIO},function(result){
      spots = result.spots;
      for(i=0; i<spots.length ;i++){
        if(spots[i].ID_SPOT !=='undefined'){
        console.log("Se encontro el id de spot, siguiendo");
        id_spot = spots[i].ID_SPOT;
          $.post("/consultarReservasPorSpot",{spot_id:id_spot},function(result){
            reservas2 = result.reservas;
            console.log(reservas2);
            for(x=0;x<reservas2.length;x++){
              if(reservas2[x].ID_RESERVA!=='undefined'){
                $("#tabla_reservas_spots").append('<tr><th scope="row">' + reservas2[x].ID_RESERVA + '</th><td>' +reservas2[x].UBICACION_DESC + '</td><td>' + reservas2[x].FECHA_INICIO + '</td><td>' + reservas2[x].FECHA_FIN + '</td><td> ' + reservas2[x].HORA_INICIO + '</td><td> ' + reservas2[x].HORA_FIN + '</td><td>$' + Math.floor(Math.random()*100) + '</td><td>' + reservas2[x].PLACA + '</td><td>' + reservas2[x].ESTATUS + '</td><td><p><a class="btn btn-danger" target="_blank" href="#"" role="button">Delete</a></td></tr>');
              };
            };
          });
      };
      }
});


$.post("/consultarCoches",{id_usuario:usuario.ID_USUARIO},function(result){
      vehiculos = result.vehiculos;
      console.log(vehiculos);
      for(i=0; i < vehiculos.length ;i++){
        $("#tabla_my_vehicles").append('<tr><th scope="row">' + vehiculos[i].ID_VEHICULO + '</th><td>' + vehiculos[i].MARCA + '</td><td>' + vehiculos[i].ANIO + '</td><td>' + vehiculos[i].PLACA + '</td><td> ' + vehiculos[i].COLOR + '</td><td>' +'</td><td><p><a class="btn btn-danger" onclick="EliminarVehiculo(' + vehiculos[i].ID_VEHICULO + '); return false" href="#" role="button">Delete</a></td></tr>');
    }
});

$("#AgregarNuevoVehiculo").on('click',function(){
  $("#input_usuario").val(usuario.NOMBRE + " "  + usuario.APELLIDO);
});

$("#confirmarCreacionVehiculo").on('click',function(){
  info = {
      "ID_USUARIO": usuario.ID_USUARIO,
      "MARCA": $("#dropdown_brand").val(),
      "ANIO": $("#dropdown_year").val(),
      "PLACA": $("#input_plates").val(),
      "COLOR_COCHE": $("#dropdown_color").val()
  };

$.post("/CrearCoche",{"info":info},function(result){
    resultado = result.resultado;
    if (resultado == "success"){
        console.log(resultado);
        mensaje = "Tu vehiculo se creó de manera exitosa.";
        console.log(mensaje);
      } else {
        mensaje = "Hubo un error en tu reservación. Inténtalo de nuevo más tarde."
      }
      console.log("Se realizó el post satisfactoriamente.");
      $("#modalCreacionVehiculo").modal('hide');
      $("#MensajeModalConfirmacion").html(mensaje);
      $("#modalConfirmacionVehiculo").modal('show');
  });
});

function EliminarVehiculo(id_vehiculo){
  if (window.confirm("Do you really want to delete the vehicle?")) { 
    console.log(id_vehiculo);
    $.post('/EliminarVehiculo', {"id_vehiculo":id_vehiculo}, function(result){
      var resultado = result.resultado;
      console.log(resultado);
      if (resultado == "success"){
          mensaje = "Tu vehiculo se eliminó de manera exitosa.";
          console.log("Se realizó el post satisfactoriamente.");
          $("#MensajeModalConfirmacion").html(mensaje);
          $("#modalConfirmacionVehiculo").modal('show');
        } else {
          mensaje = "Hubo un error. Inténtalo de nuevo más tarde."
        }
    });
  }
};

// id, marca, año, placa y color