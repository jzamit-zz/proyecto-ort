var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	passport = require('passport'),
    jwt = require('jwt-simple');

module.exports= function(){

var app = express();

//Si es desarrollo el ambiente uso el logger Morgan
if(process.env.NODE_ENV === 'development'){

app.use(morgan('dev'));

//Si es produccion el ambiente uso compression
}else if(process.env.NODE_ENV === 'production'){

app.use(compress());

}

app.use(bodyParser.urlencoded({
	extended:true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: config.sessionSecret
}));

app.set('views', './app/views');   // Vistas con EJS
app.set('view engine', 'ejs');     // Vistas con EJS

app.use(passport.initialize());
app.use(passport.session());

//Rutas
require('../app/routes/index.server.routes.js')(app);
require('../app/routes/users.server.routes.js')(app);
require('../app/routes/exercises.server.routes.js')(app);


//Es importante que esto del Static este debajo de las rutas para que no se acceda primero a lo estatico bajando la performance
//por la espera del IO del Filesystem por el contenido estatico
app.use(express.static('./public'));  // Contenido Estatico


return app;

};