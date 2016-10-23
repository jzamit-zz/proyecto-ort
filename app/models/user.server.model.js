var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

//User Model
var UserSchema = new Schema({

    firstName: String,
    lastName: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        match: [/.+\@.+\..+/, "Por favor usa una direccion de  e-mail valida"]
    },
    username: {
        type: String,
        unique: true,
        required: 'El usuario es requerido',
        trim: true
    },
    objective:{},
    exercises:{},
    history:[],
    isGenderMale: Boolean,
    dateOfBirth:Date,
    phisiqueData:[{
        weight: Number,
        isWeightKg: Boolean,
        height:Number,
        isHeightCm:Boolean,
        imc:Number
    }],
    password: {
        type: String,
        required: true,
        validate: [
            function (password) {
                return password && password.length > 2;
            }, 'El Password debe ser mas largo'
        ]
    },
    salt: {
        type: String
    },
   /* provider: {
        type: String,
        required: 'El Provider es requerido'
    },*/
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    }
});

//Antes de guardar el usuario encripta el password
UserSchema.pre('save', function (next) {

    if(this.username){
        this.username = this.username.toLowerCase();
    }
    if(this.email){
        this.email = this.email.toLowerCase();
    }
    if (this.password) {
        this.salt = new
            Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,
        64).toString('base64');
};

UserSchema.methods.authenticate = function (password) {

    var bandera = this.password === this.hashPassword(password);
    return bandera;

};

UserSchema.statics.findUniqueUsername = function (username, suffix,
                                                  callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) +
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};

UserSchema.set('toJSON', {
    getters: true
});

mongoose.model('User', UserSchema);
