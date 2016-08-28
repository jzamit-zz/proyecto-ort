var jwt = require('jwt-simple'),
    config = require('./config'),
    User = require('mongoose').model('User');
module.exports = function (req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        token = token.split(' ');
        try {
            var decoded = jwt.decode(token[1], config.sessionSecret);
            if (decoded.exp < Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });

                return;

            } else {

                User.findOne({
                    _id: decoded.sub
                }, function (err, user) {
                    if (err) throw err;

                    if (!user) {
                        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                    } else {
                       // res.json({success: true, msg: 'Welcome in the member area ' + user.username + '!'});
                        return next();
                    }
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
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};