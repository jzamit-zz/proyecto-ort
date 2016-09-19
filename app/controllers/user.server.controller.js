var User = require('mongoose').model('User'),
    config = require('../../config/config'),
    mongoose = require('mongoose'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    deepcopy = require("deepcopy"),
    promise = require('bluebird'),
    Exercise = require('mongoose').model('Exercise'),
    Objective = require('mongoose').model('Objective');
    promise.promisifyAll(mongoose);

var events = require('events');
var eventEmitter = new events.EventEmitter();


var banderaEjercicios = false;
var ejercicios = {};

var guardoDatos = function(){

    User.findByIdAndUpdate('57dd68e12f8fd20300d4e677', {exercises : ejercicios}, function (err, user) {
        if (err) {
            return next(err);
        } else {
            console.log("Agrego ejercicios ?");
           // res.json(user);

        }
    });


};
eventEmitter.on('eventoJorge', guardoDatos);

var createToken = function (user) {

    if (user != undefined || user != null) {
        var token = {};
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(7, "days").unix()
        };
        token.expire = payload.exp;
        token.payload = jwt.encode(payload, config.sessionSecret);
        return token;
    }
};

var responseTokenUser = function (user) {
    if (user != undefined || user != null) {
        var token = createToken(user);
        var userDTO = {id: user.id, username: user.username};
        var obj = {success: true, expire: token.expire, token: 'JWT ' + token.payload, user: userDTO};
    }
    return obj;
};

var setExerciseSets = function (array, set) {

    for (var i = 0; i < array.length; i++) {
        array[i].sets = set;
    }
};


var getSets = function (setNumber, setReps, exercise) {


    var sets = [];
    var setN = setNumber;
    var setR = setReps;

    for (var i = 1; i <= setN; i++) {

        sets.push({"number": i, "rep": setR, "weight": 0, "done": false});
    }

    if (exercise.biceps != undefined) {

        setExerciseSets(exercise.biceps, sets);
    }
    if (exercise.triceps != undefined) {

        setExerciseSets(exercise.triceps, sets);
    }
    if (exercise.back != undefined) {

        setExerciseSets(exercise.back, sets);
    }
    if (exercise.shoulders != undefined) {

        setExerciseSets(exercise.shoulders, sets);
    }
    if (exercise.chest != undefined) {

        setExerciseSets(exercise.chest, sets);
    }

    banderaEjercicios = true;
    ejercicios = deepcopy(exercise);
    eventEmitter.emit('eventoJorge');

    return exercise;
};


function UpdateUserDataById(id, objectData, res, next) {

    User.findByIdAndUpdate(id, objectData, function (err, user) {
        if (err) {
            return next(err);
        } else {
            console.log("ok");
            console.log(res);
            //  res.json(user);
        }
    });
}

//
// exports.update = function(req,res,next){
//
//     Objective.findByIdAndUpdate(req.objective.id, req.body, function(err, objective){
//
//         if(err){
//             return next(err);
//         }else{
//             res.json(objective);
//         }
//     });
// };
//


/*var getExerciseByObjective = function (objective) {

 promise.props({
 biceps: Exercise.find({exerciseMuscleGroupId: 1}).limit(6).execAsync(),
 triceps: Exercise.find({exerciseMuscleGroupId: 2}).limit(6).execAsync(),
 chest: Exercise.find({exerciseMuscleGroupId: 3}).limit(6).execAsync(),
 shoulders: Exercise.find({exerciseMuscleGroupId: 4}).limit(6).execAsync(),
 back: Exercise.find({exerciseMuscleGroupId: 8}).limit(6).execAsync()
 })
 .then(function (exercises) {
 console.log("Ejecuro getExerciseByObjective");
 getExerciseCustom(objective, exercises);
 })
 .catch(function (err) {
 res.send(500); // oops - we're even handling errors!
 });
 };*/


var getExerciseCustom = function (objective, exercises) {

    if (objective != undefined && exercises != undefined) {

        switch (objective) {

            case 'Get Slim':
                return getSets(3, 25, exercises);
                break;

            case 'Get Fit':
                console.log("Ejecuto getExerciseCustom");
                return getSets(5, 15, exercises);

                break;

            case 'Get Big':
                return getSets(6, 12, exercises);
                break;

            case 'Get Strong':
                return getSets(5, 5, exercises);
                break;

            default:
                console.log("Error en user.server controller")
                break;
        }
    }

};

exports.create = function (req, res, next) {

    var user = new User(req.body);
    user.save(function (err) {
        if (err) {
            return next(err);
        } else {
            var retornar = responseTokenUser(user);
            res.json(retornar);
        }
    });
};

exports.authenticate = function (req, res, next) {

    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            return next(err);
        } else {
            if (!user) {
                res.send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                if (req.body.password == undefined) {
                    res.status(401);
                    res.send({success: false, msg: 'No password field.'});
                    return next();
                } else {
                    if (user.authenticate(req.body.password)) {
                        var retornar = responseTokenUser(user);
                        res.json(retornar);
                    } else {
                        res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                    }
                }
            }
        }
        next();
    });
};

exports.list = function (req, res, next) {

    User.find({}, 'id firstName lastName email', function (err, users) {
        if (err) {
            return next(err);
        } else {
            res.json(users);
        }
    });
};

// Para que devuelva el usuario by ID
exports.read = function (req, res) {
    res.json(req.user);
};

exports.userByID = function (req, res, next, id) {

    User.findOne({
        _id: id
    }, 'id firstName lastName email', function (err, user) {

        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

exports.update = function (req, res, next) {

    var objectiveDTO;
    var objeto;
    var bandera = true;
    var banderaDos = false;


    if (req.body.objective != undefined) {
        bandera = false;

        Objective.findOne({name: req.body.objective.name}, function (err, data) {

            if (err) {
                return next(err);

            } else {

                promise.props({
                    biceps: Exercise.find({exerciseMuscleGroupId: 1}).limit(6).execAsync(),
                    triceps: Exercise.find({exerciseMuscleGroupId: 2}).limit(6).execAsync(),
                    chest: Exercise.find({exerciseMuscleGroupId: 3}).limit(6).execAsync(),
                    shoulders: Exercise.find({exerciseMuscleGroupId: 7}).limit(6).execAsync(),
                    back: Exercise.find({exerciseMuscleGroupId: 8}).limit(6).execAsync()

                })
                    .then(function (results) {

                        getExerciseCustom(data.name, results);

                    })

                    .catch(function (err) {
                        console.log(err);
                        res.sendStatus(500); // oops - we're even handling errors!
                    });


                //procesar ejercicios


                /*

                 console.log(results);

                 if(results != undefined){

                 console.log("FUNCIONO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

                 console.log(results);
                 }
                 // ejercicios = getExerciseCustom(objective.name, results); // getSets(4, 12, results);
                 objeto = {exercise:results.fun, objective:data};

                 if(results.fun != undefined){

                 UpdateUserDataById('57dd68e12f8fd20300d4e677', objeto);
                 }
                 */


                // objeto = {exercise:ejercicios, objective:data};
                //UpdateUserDataById('57dd68e12f8fd20300d4e677', objeto);

                // promise.props({
                //     biceps: Exercise.find({exerciseMuscleGroupId: 1}).limit(6).execAsync(),
                //     triceps: Exercise.find({exerciseMuscleGroupId: 2}).limit(6).execAsync(),
                //     chest: Exercise.find({exerciseMuscleGroupId: 3}).limit(6).execAsync(),
                //     shoulders: Exercise.find({exerciseMuscleGroupId: 4}).limit(6).execAsync(),
                //     back: Exercise.find({exerciseMuscleGroupId: 8}).limit(6).execAsync()
                // })
                //     .then(function (results) {
                //         // console.log(results);
                //         ejercicios = getExerciseCustom(objective.name, results); // getSets(4, 12, results);
                //
                //     })
                //     .catch(function (err) {
                //         res.send(500); // oops - we're even handling errors!
                //     });
                // objectiveDTO = {"name":objective.name, "description":objective.description, "image":objective.image };


            }
        });


    }

};
exports.delete = function (req, res, next) {
    req.user.remove(function (err) {

        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    });
};


