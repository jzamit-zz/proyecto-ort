var exercises = require('../../app/controllers/exercises.server.controller');
var validateToken = require('../../config/validateRequest');
module.exports = function(app){

    var path = '/api/exercises', id= '/:exerciseId' ;

    app.get(path, validateToken, exercises.list);
    app.get(path + id, validateToken, exercises.read);
    app.post(path, validateToken, exercises.create);
    app.put(path + id, validateToken, exercises.update);
    app.delete(path + id, validateToken, exercises.delete);
    app.param('exerciseId', exercises.exerciseByID);
};
