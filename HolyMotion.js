var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var o = require('odata');

app.use(bodyParser.json());

var port = process.env.PORT || '8080';
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true})); 

o().config({
  format: 'json',
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
			}
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
				NOMBRE: data.d.results[0].NOMBRE,
				APELLIDO: data.d.results[0].APELLIDO,
				ID_LUGAR: data.d.results[0].ID_LUGAR,
				DIRECCION: data.d.results[0].DIRECCION,
				EMAIL: data.d.results[0].EMAIL
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

function usuarioExists(email){
	
};

