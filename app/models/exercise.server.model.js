var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var ExerciseSchema = new Schema({
    exerciseMuscleGroupId: {
        type: Number,
        required: true
    },
    exerciseMuscleGroupName: {
        type: String,
        required: true
    },

    orderExercise:{
        type: Number,
        required: true
    },
    sets: [],
    exerciseName: {
        type: String,
        required: true
    },
    isBasic : {
        type: Boolean,
        required: true
    },
    isAerobic: {
        type: Boolean,
        required: true
    },
    exercisePriority: {
        type: Number,
        required: true
    },

    exerciseDesc:{
        type: String,
        required: true
    },
    exerciseVariations: String,
    exerciseTip: String,
    media:{
        thumb:String,
        thumbOn:String,
        thumbOff:String,
        thumbMainMuscle: String,
        videoUrl: String
    },
    exerciseRest:Number,
    exerciseDuration: Number,
    done : Boolean

}, {timestamps: true});

//
// ExerciseSchema.statics.findUniqueUsername = function (username, suffix,
//                                                   callback) {
//     var _this = this;
//     var possibleUsername = username + (suffix || '');
//     _this.findOne({
//         username: possibleUsername
//     }, function (err, user) {
//         if (!err) {
//             if (!user) {
//                 callback(possibleUsername);
//             } else {
//                 return _this.findUniqueUsername(username, (suffix || 0) +
//                     1, callback);
//             }
//         } else {
//             callback(null);
//         }
//     });
// };



ExerciseSchema.set('toJSON', {
    getters: true
});

mongoose.model('Exercise', ExerciseSchema);
