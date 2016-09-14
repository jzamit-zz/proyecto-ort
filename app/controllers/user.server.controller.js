var User = require('mongoose').model('User'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    Exercise = require('mongoose').model('Exercise'),
    Objective = require('mongoose').model('Objective');

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


var getSets = function (setNumber, setReps, exercise) {
    var sets = [];
    var setNumber = setNumber;
    var setReps = setReps;
    var set = {
        "number": null,
        "rep": setReps,
        "weight": 0,
        "done": false
    };
    if(!exercise.isAerobic){
        for(var i=1; i <= setNumber; i++){
            set.number = i;
            sets.push(set);
        }
    }else{
        set.number = 1;
        set.rep = 0;
        sets.push(set);
    }
    exercise.sets = sets;
    return exercise;
};


var makeRutineDay = function () {

    console.log("Ejecuto : makeRutineDay() ");

   var ejercicios = [{"hola":1},{"hola":2}];

    User.findByIdAndUpdate('57d77196cc5f6ba3402f198c', {exercises:ejercicios}, function (err, user) {
        if (err) {
            return next(err);
        } else {
            console.log(user);
        }
    });



    // var day = {};
    // var muscleGroupId1 = ex1;
    // var muscleGroupId2 = ex2;
    // var exercisesFromDb = exercises;
    //
    // if(exercisesFromDb == undefined || exercisesFromDb.length == 0){
    //     return;
    // }
    //
    // if(muscleGroupId1 == undefined){
    //     return;
    // }
    //
    // for(var i = 0; i < exercisesFromDb.length; i++){
    //
    //     if(exercisesFromDb[i].exerciseMuscleGroupId == muscleGroupId1){
    //         // es BICEP
    //         if(exercisesFromDb[i].isBasic && cantEjerciciosTipoBasico < 3){
    //             //Agregue menos que 3
    //             exercisesToUser.push(exercisesFromDb[i]);
    //             cantEjerciciosTipoBasico ++;
    //         }
    //
    //         if(!exercisesFromDb[i].isBasic && cantEjerciciosNoBasicos < 2){
    //             exercisesToUser.push(exercisesFromDb[i]);
    //             cantEjerciciosNoBasicos++;
    //         }
    //
    //         if(exercisesFromDb[i].isAerobic && cantEjerciciosAerobicos < 1){
    //
    //             ejercicioAerobico = exercisesFromDb[i];
    //             cantEjerciciosAerobicos++;
    //         }
    //     }
    // }
    // // Al finalizar de agreger todos los ejercicios agrego el aerbico
    // if(ejercicioAerobico != undefined){
    //     exercisesToUser.push(ejercicioAerobico);
    // }
    //
    // cantEjerciciosTipoBasico = 0;
    // cantEjerciciosNoBasicos = 0 ;
    // cantEjerciciosAerobicos = 0 ;
    //
    //
    //

};


var getExercises = function () {

    var cantEjerciciosTipo = 0 ;
    var cantEjerciciosTipoBasico = 0;
    var cantEjerciciosNoBasicos = 0 ;
    var cantEjerciciosAerobicos = 0 ;
    var ejercicioAerobico;
    var exercisesFromDb = [];
    var exercisesToUser = [];
    var mes = [];
    var semana = [];
    var dia = [];

   // makeRutineDay();

    var results = [];
    var query = [];

    query[0] = Exercise.find({exerciseMuscleGroupId:1}).limit(6);
    query[1] = Exercise.find({exerciseMuscleGroupId:2}).limit(6);
    query[2] = Exercise.find({exerciseMuscleGroupId:3}).limit(6);
    query[3] = Exercise.find({exerciseMuscleGroupId:4}).limit(6);
    query[4] = Exercise.find({exerciseMuscleGroupId:5}).limit(6);
    query[5] = Exercise.find({exerciseMuscleGroupId:6}).limit(6);

    for(var i = 0; i < 6; i++) {

        query[i].exec(function (err, data) {

            if (!err) {
                results.push(data);
                if(i==5){
                    console.log(results);

                }
            }
        });

    }


    //Exercise.find({exerciseMuscleGroupId:1}, function(err, exercises){

        // if(err){
        //     console.log("error al traer ejercicios desde Bd User serve controller linea 71");
        //     return next(err);
        //
        // }else{
        //
        //
        //     console.log(exercises);

          /*  exercisesFromDb = exercises ;
            for(var i = 0; i < exercisesFromDb.length; i++){g

                if(exercisesFromDb[i].exerciseMuscleGroupId == 1){
                    // es BICEP
                    if(exercisesFromDb[i].isBasic && cantEjerciciosTipoBasico < 3){
                        //Agregue menos que 3
                        exercisesToUser.push(exercisesFromDb[i]);
                        cantEjerciciosTipoBasico ++;
                    }

                    if(!exercisesFromDb[i].isBasic && cantEjerciciosNoBasicos < 2){
                        exercisesToUser.push(exercisesFromDb[i]);
                        cantEjerciciosNoBasicos++;
                    }

                    if(exercisesFromDb[i].isAerobic && cantEjerciciosAerobicos < 1){

                        ejercicioAerobico = exercisesFromDb[i];
                        cantEjerciciosAerobicos++;
                    }
                }
            }
            // Al finalizar de agreger todos los ejercicios agrego el aerbico
            if(ejercicioAerobico != undefined){
                exercisesToUser.push(ejercicioAerobico);
            }

            cantEjerciciosTipoBasico = 0;
            cantEjerciciosNoBasicos = 0 ;
            cantEjerciciosAerobicos = 0 ;*/
    //     }
    // });



};

var getExerciseCustom = function (objective, exercises) {

    if(objective != undefined && exercises != undefined){

        for(var i=0; i < exercises.length; i++){

            switch(objective) {

                case 'Get Slim':
                    return getSets(3,10,exercises[i]);
                    break;

                case 'Get Fit':
                    return getSets(5,15,exercises[i]);
                    break;

                case 'Get Big':
                    return getSets(6,12,exercises[i]);
                    break;

                case 'Get Strong':
                    return getSets(5,5,exercises[i]);
                    break;

                default:
                    break;
            }
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

    User.findByIdAndUpdate(req.user.id, req.body, function (err, user) {
        if (err) {
            return next(err);
        } else {

            //si actualizo objetivo debo actualizar sus ejercicios
            if(req.user.objective){

                Objective.findOne({name:req.user.objective.name}, function(err, objective){

                    if (err) {
                        return next(err);
                    } else {
                        req.objective = objective;
                        //next();








                    }



                })


            }










            res.json(user);
        }
    });
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


exports.getMyExercises = function (req, res, next) {

  //  var user = new User(req.body.user);
  //  var obj = new Objective(req.body.objective);

    getExercises();







   /* user.save(function (err) {
        if (err) {
            return next(err);
        } else {
            var retornar = responseTokenUser(user);
            res.json(retornar);
        }
    });*/
};