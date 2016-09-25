var objective = require('../../app/controllers/objective.server.controller');

module.exports = function (app) {

    var path = '/api/objectives', id = '/:objectiveId', parameter = 'objectiveId' ;

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
        res.header("Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Header, Authorizations");
        next();
    });

    app.route(path).post(objective.create).get(objective.list);
    app.route(path + id).get(objective.read).put(objective.update).delete(objective.delete);
    app.param(parameter, objective.objectiveByID);
};