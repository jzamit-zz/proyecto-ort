var passport = require('passport'),
	mongoose = require('mongoose'),
    ExtractJwt = require('passport-jwt').ExtractJwt,
    config = require('./config');

	module.exports = function() {
        var jwtStrategy = require('passport-jwt').Strategy;
        var User = mongoose.model('User');
	    var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
        opts.secretOrKey = config.sessionSecret;
        passport.use(new jwtStrategy(opts, function(jwt_payload, done) {
            User.findOne({userName: jwt_payload.userName}, function(err, user) {
                if (err) {
                    return done(err, false);
                }if
                (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        }));






		/*passport.serializeUser(function(user, done) {
			done(null, user.id);
		});
		passport.deserializeUser(function(id, done) {
		User.findOne({
		_id: id
		}, '-password -salt', function(err, user) {
		done(err, user);
			});
		});
		require('./strategies/local.js')();

		*/
	};