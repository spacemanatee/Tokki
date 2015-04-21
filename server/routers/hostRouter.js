var hostController = require('../controllers/hostController');

module.exports = function(app, passport) {
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/#/hostMenu', failureRedirect: '/#/host/login' }));
  app.post('/logout', hostController.logout);
  app.post('/new', isLoggedIn, hostController.registerSession);
  app.post('/newTrial', hostController.registerSession);
  app.get('/old/:sessionId', isLoggedIn, hostController.retrieveSession);
  app.get('/old', isLoggedIn, hostController.retrieveSessions);
  app.get('/:sessionId', hostController.redirect);
  app.get('/', hostController.redirect);
};

var isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};
