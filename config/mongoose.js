var config = require('./config'),
	mongoose = require('mongoose');


module.exports = function(){
	
var db = mongoose.connect(config.db,function (error) {

    if (error) console.error('Error conexion de Bd Mongo, Error: ' + error);
    
    else console.log('mongo connected');
});

require('../app/models/user.server.model');   // Estoy registrando el modelo user creado anteriormente

return db;


};