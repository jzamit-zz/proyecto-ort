var Exercise = require('mongoose').model('Exercise');

exports.create = function(req,res,next){

    var exercise = new Exercise(req.body);

    exercise.save(function(err){

        if(err){
            return next(err);
        }else{
            res.json(exercise);
        }
    });
};

exports.list = function(req,res,next){

    Exercise.find({}, function(err, exercises){

        if(err){
            return next(err);
        }else{

            res.json(exercises);
        }
    });
};

// Para que devuelva el ejercicio por ID
exports.read = function(req,res){
    res.json(req.exercise);
};

exports.exerciseByID = function(req,res,next,id){

    Exercise.findOne({
        _id:id
    }, function(err, exercise){
        if(err){
            return next(err);
        }else{
            req.exercise = exercise;
            next();
        }
    });
};

exports.update = function(req,res,next){

    Exercise.findByIdAndUpdate(req.exercise.id, req.body, function(err, exercise){

        if(err){
            return next(err);
        }else{
            res.json(exercise);
        }
    });
};

exports.delete = function(req, res, next){
    req.exercise.remove(function(err){

        if(err){
            return next(err);
        }else{
            res.json(req.exercise);
        }
    });
};
