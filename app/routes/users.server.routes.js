var users = require('../../app/controllers/users.server.controller');

module.exports = function (app) {


    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    app.route('/users').post(users.create).get(users.list);
    app.route('/users/authenticate').post(users.authenticate);
    app.route('/users/:userId').get(users.read).put(users.update).delete(users.delete);
    app.param('userId', users.userByID);


};