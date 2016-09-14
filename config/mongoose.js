var config = require('./config'),
    mongoose = require('mongoose');
module.exports = function () {

    var db = mongoose.connect(config.db, function (error) {

        if (error) console.error('Error conexion de Bd Mongo, Error: ' + error);

        else console.log('mongo connected');
    });

    // Estoy registrando los modelos creados anteriormente
    require('../app/models/user.server.model');
    require('../app/models/exercise.server.model');
    require('../app/models/objective.server.model');

    return db;
};

