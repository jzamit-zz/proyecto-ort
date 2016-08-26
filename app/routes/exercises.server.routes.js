var exercises = require('../../app/controllers/exercises.server.controller');

module.exports = function(app){
    app.route('/exercises').post(exercises.create).get(exercises.list);
    app.route('/exercises/:exerciseId').get(exercises.read).put(exercises.update).delete(exercises.delete);
    app.param('exerciseId', exercises.exerciseByID);
};
