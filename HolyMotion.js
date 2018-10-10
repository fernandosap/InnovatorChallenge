var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var o = require('odata');
var request = require('request');

app.use(bodyParser.json());

var port = process.env.PORT || '8080';
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true})); 

o().config({
  // format: 'json',
  username: 'i848070', 	// the basic auth username
  password: 'WelcomeWelcome1.',
  isWithCredentials: true
});

app.get('/', function(req, res) {
	res.render('login');
});

app.get('/bienvenido', function(req, res) {
	res.render('bienvenido');
});

app.get('/ContactUs', function(req, res) {
	res.render('ContactUs');
});

app.get('/MyAccount', function(req, res) {
	res.render('MyAccount');
});

app.get('/OurTeam', function(req, res) {
	res.render('OurTeam');
});

app.get('/home', function(req,res){
	res.render('home');
});

app.listen(port, function(req,res){
   console.log("Servidor Corriendo en puerto: " + port); 
});

app.get('/Signin', function(req,res){
	res.render('signup')
});


// INICIAN POSTS DE FUNCIONALIDAD -----------------------------

app.post('/consultarVehiculos',function(req,res){
	usuario = req.body.usuario;
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/vehiculos?$filter=ID_USUARIO eq " + usuario;
	o(url).get(function(data){
		if(typeof data.d.results[0] !== 'undefined'){
			console.log(data.d.results);
			respuesta = ({"vehiculos":data.d.results,"existe":true});
			res.send({"resultado": respuesta});
		} else {
			respuesta = ({"existe":false});
			res.send({"resultado": respuesta});
		};
	});
});

app.post('/consultarCoches', function(req,res){
	id_usuario = req.body.id_usuario;
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/vehiculos?$filter=ID_USUARIO eq " + id_usuario;
	o(url).get(function(data){
		vehiculos = data.d.results;
		console.log("El resultado de consultar vehiculos: " + vehiculos);
		res.send({"vehiculos":vehiculos});
	})
});

app.post('/EliminarVehiculo', function(req, res){
	console.log("El vehículo a eliminar es: " + req.body.id_vehiculo);
	id_vehiculo = req.body.id_vehiculo;

	// opciones para configuración del DELETE
	var options = {
	    url: "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/vehiculos(" + id_vehiculo +")",
	    method: 'DELETE',
	    auth: {
	    'user': 'i848070',
	    'pass': 'WelcomeWelcome1.'
		}
	};

	console.log(options.url);

	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 204) {
	        console.log("El status de respuesta es: " + response.statusCode);
	        res.send({"resultado":"success"}); 
	    } else {
	    	console.log("El error de respuesta es: " + error);
	    	res.send({"resultado":"fail"}); 
	    };
	});
});

app.post('/CrearCoche', function(req,res){
	// id de vehiculo, id de usuario, marca, anio, placa y el color
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/vehiculos";
	console.log(req.body.info);
	o(url).get(function(data) {
		numero_nuevo = Number(data.d.results.length) + 1;
		info = {
			"ID_VEHICULO": numero_nuevo,
			"ID_USUARIO": req.body.info.ID_USUARIO,
			"MARCA": req.body.info.MARCA,
			"ANIO": req.body.info.ANIO,
			"PLACA": req.body.info.PLACA,
			"COLOR": req.body.info.COLOR_COCHE 
		};
		o(url).post(info).save(function(data){
			console.log("Información agregada satisfactoriamente");
			res.send({"resultado":"success"});  
		}, function(status, error){
			console.error(status + " " + error);
			res.send({"resultado":"error"});  
		});
	});
});

app.post('/consultarReservas',function(req,res){
id_usuario = req.body.id_usuario;
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/reservas?$filter=ID_USUARIO_RESERVA eq " + id_usuario
	o(url).get(function(data){
		reservas = data.d.results;
		console.log("El resultado de consultar reservas: " + reservas);
		res.send({"reservas":reservas});
	})
});

app.post('/consultarReservasPorSpot',function(req,res){
spot = req.body.spot_id;
console.log(spot);
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/reservas?$filter=ID_SPOT eq " + spot
	o(url).get(function(data){
		reservas = data.d.results;
		console.log("El resultado de reservas por spot " + reservas);
		res.send({"reservas":reservas});
	})
});

app.post('/consultarSpots',function(req,res){
	id_usuario = req.body.id_usuario;
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/spots?$filter=ID_USUARIO eq " + id_usuario
	o(url).get(function(data){
		spots = data.d.results;
		console.log(spots);
		res.send({"spots":spots});
	})
})

app.post('/SignUp', function(req,res){
	array = req.body.signup_array;
	email = array[2];
	url_usuarios = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/usuarios";
	url_busqueda = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/usuarios?$filter=EMAIL eq '" + email + "'"
	console.log(array);
	var respuesta ="";
	console.log("Buscando usuario: " + email)
	o(url_busqueda).get(function(data) {
		if(typeof data.d.results[0] !== 'undefined'){
			var user = {
				NOMBRE: data.d.results[0].NOMBRE,
				APELLIDO: data.d.results[0].APELLIDO,
				ID_LUGAR: data.d.results[0].ID_LUGAR,
				DIRECCION: data.d.results[0].DIRECCION,
				EMAIL: data.d.results[0].EMAIL
			};
			respuesta = {"existe":true,user:user};
			console.log("usuario existe: " + respuesta.existe);
		} else {
			respuesta = ({"existe":false});
			console.log("usuario no existe: " + respuesta.existe);
		}

		existe = respuesta.existe;
		console.log("existe: " + existe);

		if (existe == false) {
			console.log("creando nuevo usuario");
			o(url_usuarios).get(function(data) {
				numero_nuevo = Number(data.d.results.length) + 1;
				info = {
					"ID_USUARIO": numero_nuevo, 
					"NOMBRE": array[0], 
					"APELLIDO":array[1],
					"DIRECCION":array[3], 
					"EMAIL":array[2], 
					"TELEFONO":array[4], 
					"PASSWORD":array[5]
				};
				console.log("numero nuevo: " + numero_nuevo);

				o(url_usuarios).post(info).save(function(data){
					console.log("Información agregada satisfactoriamente");
					res.send({"resultado":"nuevo"});  
				}, function(status, error){
					console.error(status + " " + error);
					res.send({"resultado":"error"});  
				});
				}, function(status) {
			console.error(status); // error with status
			});
			} else {
			console.log("enviando resultado existente")
			res.send({"resultado":"existente"});
		};
	}, function(status) {
		console.error(status); // error with status
		respuesta = ({"existe":"error"})
	});
});

app.post('/validarLogin', function(req,res){
	console.log("Imprimiendo información");
	email = req.body.email;
	pass = req.body.pass;
	console.log(email);
	console.log(pass);
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/usuarios?$filter=EMAIL eq '" + email + "'"
	o(url).get(function(data) {
		if(typeof data.d.results[0] !== 'undefined'){
			var user = {
				"ID_USUARIO": data.d.results[0].ID_USUARIO,
				"NOMBRE": data.d.results[0].NOMBRE,
				"APELLIDO": data.d.results[0].APELLIDO,
				"ID_LUGAR": data.d.results[0].ID_LUGAR,
				"DIRECCION": data.d.results[0].DIRECCION,
				"EMAIL": data.d.results[0].EMAIL
			}
			console.log(data.d.results[0]);
			if(pass == data.d.results[0].PASSWORD){
			console.log('Usuario autenticado satisfactoriamente: ' + email);
			res.json({"login":true,user:user});
			} else {
				console.log('Usuario no autenticado: ' + email);
				res.send({"login":false});
			}
		} else {
			console.log('Usuario no encontrado: ' + email);
			res.send({"login":false});
		}
	}, function(status) {
	console.error(status); // error with status
	});
});

app.post('/crearReserva',function(req,res){
	var numero_nuevo = 0;
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/reservas";
	o(url).get(function(data) {
		numero_nuevo = Number(data.d.results.length);
		info = {
			ID_RESERVA: numero_nuevo+1,
			ID_SPOT: Number(req.body.ID_SPOT),
			ID_USUARIO_RESERVA: Number(req.body.ID_USUARIO_RESERVA),
			FECHA_INICIO: req.body.FECHA_INICIO,
			FECHA_FIN: req.body.FECHA_FIN,
			HORA_INICIO: req.body.HORA_INICIO,
			HORA_FIN: req.body.HORA_FIN,
			UBICACION_DESC: req.body.UBICACION_DESC,
			PLACA: req.body.PLACA,
			ESTATUS: "Pendiente"
		}
		console.log(info);
		o(url).post(info).save(function(data){
			res.send({"resultado":"success","id_reserva":data.d.ID_RESERVA});  
		}, function(status, error){
			console.error(status + " " + error);
			res.send({"resultado":"error"});  
		});
	});	
});

app.post('/contarSpots',function(req,res){
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/spots"
	o(url).get(function(data) {
				numero_nuevo = Number(data.d.results.length);
				res.send({"contador":numero_nuevo,"spots":data});
	});
});

app.post('/nuevoIDReserva',function(req,res){
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/reservas"
	o(url).get(function(data) {
				numero_nuevo = Number(data.d.results.length);
				res.send({"ultima_reserva":numero_nuevo,"reservas":data});
	});
});

app.post('/obtenerImagenesUsuario', function(req,res){
	id_usuario = req.body.id_usuario;
	url = "https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata/usuarios?$filter=ID_USUARIO eq " + id_usuario
	o(url).get(function(data){
		usuario = data.d.results[0];
		console.log(usuario);
		foto1 = usuario.IMAGEN_1;
		foto2 = usuario.IMAGEN_2;
		res.send({"foto1":foto1,"foto2":foto2});
	})
});