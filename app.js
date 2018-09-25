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
  // endpoint:'https://hanadblaci1355a05c4.us2.hana.ondemand.com/HOLY_MOTION/usuarios.xsodata',
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
	array = req.body.signup_array
	// crear post en odata
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

