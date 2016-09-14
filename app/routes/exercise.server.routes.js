var exercises = require('../../app/controllers/exercise.server.controller');
var validateToken = require('../../config/validateRequest');
module.exports = function(app){

    var path = '/api/exercises', id = '/:exerciseId', parameter = 'exerciseId' ;

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, X-Auth-Token, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        next();
    });

    app.get(path, exercises.list);
    app.get(path + id, exercises.read);
    app.post(path, exercises.create);
    app.put(path + id, exercises.update);
    app.delete(path + id, exercises.delete);
    app.param(parameter, exercises.exerciseByID);

};
