var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Objective Model
var ObjectiveSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: true
    },
    image:  {
        type: String,
        trim: true
    }

}, {timestamps: true});

ObjectiveSchema.statics.findUniqueName = function (name, suffix,
                                                  callback) {
    var _this = this;
    var possibleName = name + (suffix || '');
    _this.findOne({
        name: possibleName
    }, function (err, objective) {
        if (!err) {
            if (!objective) {
                callback(possibleName);
            } else {
                return _this.findUniqueName(name, (suffix || 0) +
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};

ObjectiveSchema.set('toJSON', {
    getters: true
});

mongoose.model('Objective', ObjectiveSchema);
