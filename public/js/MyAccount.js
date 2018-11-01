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
        $("#tabla_reservas").append('<tr><th scope="row">' + reservas[i].ID_RESERVA + '</th><td>' + reservas[i].UBICACION_DESC + '</td><td>' + reservas[i].FECHA_INICIO + '</td><td>' + reservas[i].FECHA_FIN + '</td><td> ' + reservas[i].HORA_INICIO + '</td><td> ' + reservas[i].HORA_FIN + '</td><td>$' + Math.floor(Math.random()*100) + '</td><td>' + reservas[i].PLACA + '</td><td>' + reservas[i].ESTATUS + '</td><td><p><a class="btn btn-danger" onclick="EliminarObjeto(1,' + reservas[i].ID_RESERVA + '); return false" href="#"" role="button">Delete</a></td></tr>');
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
            console.log("Imprimiendo la información de las reservas para segunda tabla");
            console.log(reservas2);
            for(x=0;x<reservas2.length;x++){
              if(reservas2[x].ID_RESERVA!=='undefined'){
                if(reservas2[x].ESTATUS == 'Confirmed'){
                  $("#tabla_reservas_spots").append('<tr><th scope="row">' + reservas2[x].ID_RESERVA + '</th><td>' +reservas2[x].UBICACION_DESC + '</td><td>' + reservas2[x].FECHA_INICIO + '</td><td>' + reservas2[x].FECHA_FIN + '</td><td> ' + reservas2[x].HORA_INICIO + '</td><td> ' + reservas2[x].HORA_FIN + '</td><td>$' + Math.floor(Math.random()*100) + '</td><td>' + reservas2[x].PLACA + '</td><td>' + reservas2[x].ESTATUS + '</td><td><p><a class="btn btn-danger" onclick="EliminarObjeto(2,' + reservas2[x].ID_RESERVA + '); return false" href="#"" role="button">Delete</a></td></tr>');
                } else if (reservas2[x].ESTATUS == 'Pending'){
                  $("#tabla_reservas_spots").append('<tr><th scope="row">' + reservas2[x].ID_RESERVA + '</th><td>' +reservas2[x].UBICACION_DESC + '</td><td>' + reservas2[x].FECHA_INICIO + '</td><td>' + reservas2[x].FECHA_FIN + '</td><td> ' + reservas2[x].HORA_INICIO + '</td><td> ' + reservas2[x].HORA_FIN + '</td><td>$' + Math.floor(Math.random()*100) + '</td><td>' + reservas2[x].PLACA + '</td><td>' + reservas2[x].ESTATUS + '<td><p><a class="btn btn-success" onclick="ConfirmarObjeto(2,' + reservas2[x].ID_RESERVA + '); return false" href="#"" role="button">Confirm</a></td>' + '</td><td><p><a class="btn btn-danger" onclick="EliminarObjeto(2,' + reservas2[x].ID_RESERVA + '); return false" href="#"" role="button">Delete</a></td></tr>');
                }
              };
            };
          });
      };
      }
});


$.post("/consultarCoches",{id_usuario:usuario.ID_USUARIO},function(result){
      vehiculos = result.vehiculos;
      var tabla = "vehiculos";
      console.log(vehiculos);
      for(i=0; i < vehiculos.length ;i++){
        $("#tabla_my_vehicles").append('<tr><th scope="row">' + vehiculos[i].ID_VEHICULO + '</th><td>' + vehiculos[i].MARCA + '</td><td>' + vehiculos[i].ANIO + '</td><td>' + vehiculos[i].PLACA + '</td><td> ' + vehiculos[i].COLOR + '</td><td>' +'</td><td><p><a class="btn btn-danger" onclick="EliminarObjeto(3,' + vehiculos[i].ID_VEHICULO + '); return false" href="#" role="button">Delete</a></td></tr>');
    }
});

$.post("/consultarSpots",{id_usuario:usuario.ID_USUARIO},function(result){
      spots = result.spots;
      var tabla = "spots";
      console.log(spots);
      for(i=0; i < spots.length ;i++){
        $("#tabla_my_spots").append('<tr><th scope="row">' + spots[i].ID_SPOT + '</th><td>' + spots[i].DIRECCION + '</td>' + '<td><p><a class="btn btn-danger" onclick="EliminarObjeto(4,' + spots[i].ID_SPOT + '); return false" href="#" role="button">Delete</a></td></tr>');
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
      $("#Close_modal_confirmacion").on('click',function(){
        location.reload();
      });

  });
});

$("#AgregarNuevoSpot").on('click',function(){
  $("#input_usuario_spot").val(usuario.NOMBRE + " "  + usuario.APELLIDO);
});

$("#confirmarCreacionSpot").on('click',function(){
  if($("#pac-input").val()==""){
    alert("It is necessary to have a valid address");
  } else {
    direccion = $("#pac-input").val()
    $.post('/CrearSpot', {"ID_USUARIO":usuario.ID_USUARIO, "DIRECCION":direccion}, function(result){
      var resultado = result.resultado;
      console.log(resultado);
      if (resultado == "success"){
          mensaje = "Tu Spot se ha agregado de manera exitosa";
          console.log("Se realizó el post satisfactoriamente.");
          $("#modalCreacionSpot").modal('hide');
          $("#MensajeModalConfirmacion").html(mensaje);
          $("#modalConfirmacionVehiculo").modal('show');
          $("#Close_modal_confirmacion").on('click',function(){
            location.reload();
          });
        } else {
          mensaje = "Hubo un error. Inténtalo de nuevo más tarde."
        }
    });
  }
});

function EliminarObjeto(tabla,id_objeto){
  if(tabla == 1 || tabla == 2){
    tabla_eliminar = "reservas";
  } else if(tabla == 3 ){
    tabla_eliminar = "vehiculos";
  } else if(tabla == 4 ){
    tabla_eliminar = "spots";
  };
  console.log(tabla_eliminar);
  $("#modalConfirmacionVehiculoEliminado").modal('show');
  $("#Close_modal_confirmacion_eliminado").on('click',function(){ 
    console.log(tabla + " " + id_objeto);
    $.post('/EliminarObjeto', {"tabla":tabla_eliminar, "id_objeto":id_objeto}, function(result){
      var resultado = result.resultado;
      mensaje = resultado;
      console.log(resultado);
      if (resultado == "success"){
          mensaje = "Tu " + tabla + " se eliminó de manera exitosa.";
          console.log("Se realizó el post satisfactoriamente.");
          $("#modalConfirmacionVehiculoEliminado").modal('hide');
          $("#MensajeModalConfirmacion").html(mensaje);
          $("#modalConfirmacionVehiculo").modal('show');
          $("#Close_modal_confirmacion").on('click',function(){
            location.reload();
          });
        } else {
          mensaje = "Hubo un error. Inténtalo de nuevo más tarde."
        }
    });
  });
};

function ConfirmarObjeto(tabla,id_objeto){
  if(tabla == 1 || tabla == 2){
    tabla_confirmar = "reservas";
  } else if(tabla == 3 ){
    tabla_confirmar = "vehiculos";
  } else if(tabla == 4 ){
    tabla_confirmar = "spots";
  };
  console.log(tabla_confirmar);
  $("#modalConfirmacionVehiculoEliminado").modal('show');
  $("#Close_modal_confirmacion_eliminado").on('click',function(){ 
    console.log(tabla + " " + id_objeto);
    $.post('/ConfirmarObjeto', {"tabla":tabla_confirmar, "id_objeto":id_objeto}, function(result){
      var resultado = result.resultado;
      mensaje = resultado;
      console.log(resultado);
      if (resultado == "success"){
          mensaje = "Tu " + tabla + " se eliminó de manera exitosa.";
          console.log("Se realizó el post satisfactoriamente.");
          $("#modalConfirmacionVehiculoEliminado").modal('hide');
          $("#MensajeModalConfirmacion").html(mensaje);
          $("#modalConfirmacionVehiculo").modal('show');
          $("#Close_modal_confirmacion").on('click',function(){
          location.reload();
          });
        } else {
          mensaje = "Hubo un error. Inténtalo de nuevo más tarde."
        }
    });
  });
};

function cargarImagen(){
  /**
 * Two variables should already be set.
 * dropboxToken = OAuth access token, specific to the user.
 * file = file object selected in the file widget.
 */
  
  var xhr = new XMLHttpRequest();
   
  xhr.upload.onprogress = function(evt) {
    var percentComplete = parseInt(100.0 * evt.loaded / evt.total);
    // Upload in progress. Do something here with the percent complete.
  };
   
  xhr.onload = function() {
    if (xhr.status === 200) {
      var fileInfo = JSON.parse(xhr.response);
      // Upload succeeded. Do something here with the file info.
    }
    else {
      var errorMessage = xhr.response || 'Unable to upload file';
      // Upload failed. Do something here with the error.
    }
  };
   
  xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
  xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
  xhr.setRequestHeader('Content-Type', 'application/octet-stream');
  xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
    path: '/' +  file.name,
    mode: 'add',
    autorename: true,
    mute: false
  }));
   
  xhr.send(file);
};

