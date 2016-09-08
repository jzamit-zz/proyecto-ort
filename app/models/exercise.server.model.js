var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var ExerciseSchema = new Schema({
    exerciseMuscleGroupId: {
        type: Number,
        required: true,
        trim: true
    },
    exerciseMuscleGroupName: {
        type: String,
        required: true
    },
    orderExercise:{
        type: Number,
        required: true,
        trim: true
    },
    exerciseDetail: {
        sets: []
    },
    exerciseSets: Number,
    exerciseName: {
        type: String,
        required: true
    },
    exerciseDesc:{
        type: String,
        required: true
    },
    exerciseTip: {
        type: String,
        required: true
    },
    exerciseRest:Number,
    thumb:String,
    thumbOn:String,
    thumbOff:String,
    done : Boolean

}, {timestamps: true});

ExerciseSchema.set('toJSON', {
    getters: true
});

mongoose.model('Exercise', ExerciseSchema);
