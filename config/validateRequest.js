var jwt = require('jwt-simple'),
    config = require('./config'),
    User = require('mongoose').model('User'),
    moment = require('moment');

module.exports = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-auth-token'];
    if (!token) {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
    token = token.split(' ');
    if (token.length <= 0) {
        return res.status(403).send({success: false, msg: 'Malformed token.'});
    }
    try {
        var decoded = jwt.decode(token[1], config.sessionSecret);
        var today = moment().unix();
        if (decoded.exp >= today) {

            User.findOne({
                _id: decoded.sub
            }, function (err, user) {
                if (err) {
                    throw err;
                }
                if (!user) {
                    return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.'});
                }else{
                    return next();
                }
            });
        }else{
            console.log(decoded.exp >= today);
            console.log("decoded " + decoded.exp);
            console.log("today " +today);
            res.status(401).send({
                "status": 401,
                "message": "Token Expired, valid until " + decoded.exp
            });
        }
    } catch (err) {
        res.status(500);
        res.json({
            "status": 500,
            "message": "Oops something went wrong",
            "error": err
        });
    }
};