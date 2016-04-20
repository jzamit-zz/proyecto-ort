
process.env.NODE_ENV = process.env.NODE_ENV || 'development' ;

// La configuracion de Mongoose debe estar primero que nadie
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();  //Debo terminar la configuracion del Passport



app.listen('vast-tundra-45875.herokuapp.com',80); //Puerto al que escucha
module.exports=app;

console.log('Servidor corriendo en http://vast-tundra-45875.herokuapp.com:80');
