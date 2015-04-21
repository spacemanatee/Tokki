module.exports = {
  facebookAuth : {
    prod: {
      clientID : 'your-secret-clientID-here', // Your App ID
      clientSecret : 'your-client-secret-here', // Your App Secret
      callbackURL : 'http://localhost:3000/host/auth/facebook/callback'
    },
    dev: {
      clientID : 'your-secret-clientID-here',
      clientSecret : 'your-client-secret-here',
      callbackURL : 'http://localhost:3000/host/auth/facebook/callback'
    }
  },
  twitterAuth : {
    prod: {
      consumerKey : 'your-consumer-key-here',
      consumerSecret : 'your-client-secret-here',
      callbackURL : 'http://localhost:3000/host/auth/twitter/callback'
    },
    dev: {
      consumerKey : 'your-consumer-key-here',
      consumerSecret : 'your-client-secret-here',
      callbackURL : 'http://localhost:3000/host/auth/twitter/callback'
    }
  },
  googleAuth : {
    prod: {
      clientID : 'your-secret-clientID-here',
      clientSecret : 'your-client-secret-here',
      callbackURL : 'http://localhost:3000/host/auth/google/callback'
    },
    dev: {
      clientID : 'your-secret-clientID-here',
      clientSecret : 'your-client-secret-here',
      callbackURL : 'http://localhost:3000/host/auth/google/callback'
    }
  },
  sessionSecret: 'your-session-secret-here'
};
