var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');
var dbUtils = require('../utils/dbUtils');

module.exports = function(passport) {
  // Takes a user in the db and stores provider and id as session info
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // Takes in userInfo from session and finds its corresponding user in the db
  passport.deserializeUser(function(userInfo, done) {
    done(null, userInfo);
  });

  // Facebook authentication
  var facebookAuth = process.env.USER && process.env.USER.toLowerCase() === 'root' ? config.facebookAuth.prod : config.facebookAuth.dev; // Presumably there's a better test than user
  facebookAuth.profileFields = ['id', 'displayName'];
  passport.use(new FacebookStrategy(facebookAuth,
    function(accessToken, refreshToken, profile, done) {
      dbUtils.updateUser('facebook', profile, function(err) {
        if (err) {
          console.error('Failed to get/create user');
        } else {
          done(null, {
            provider: 'facebook',
            hostId: profile.id,
            displayName: profile.displayName
          });
        }
      });
    }
  ));
};
