var User = require('mongoose').model('User'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
    moment = require('moment');

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