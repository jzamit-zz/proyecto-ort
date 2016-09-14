var Objective = require('mongoose').model('Objective');

exports.create = function(req,res,next){

    var objective = new Objective(req.body);

    objective.save(function(err){

        if(err){
            return next(err);
        }else{
            res.json(objective);
        }
    });
};

exports.list = function(req,res,next){

    Objective.find({}, function(err, objective){

        if(err){
            return next(err);
        }else{

            res.json(objective);
        }
    });
};

// Para que devuelva el ejercicio por ID
exports.read = function(req,res){
    res.json(req.objective);
};

exports.objectiveByID = function(req,res,next,id){

    Objective.findOne({
        _id:id
    }, function(err, objective){
        if(err){
            return next(err);
        }else{
            req.objective = objective;
            next();
        }
    });
};

exports.update = function(req,res,next){

    Objective.findByIdAndUpdate(req.objective.id, req.body, function(err, objective){

        if(err){
            return next(err);
        }else{
            res.json(objective);
        }
    });
};

exports.delete = function(req, res, next){
    req.objective.remove(function(err){

        if(err){
            return next(err);
        }else{
            res.json(req.objective);
        }
    });
};
