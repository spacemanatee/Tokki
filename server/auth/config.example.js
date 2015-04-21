module.exports = {
  facebookAuth : {
    prod: {
      clientID : '1591541184427028', // Your App ID
      clientSecret : '83767c63c564952975777eed7d290393', // Your App Secret
      callbackURL : 'http://localhost.xip.io:3000/host/auth/facebook/callback'
    },
    dev: {
      clientID : '1591541184427028',
      clientSecret : '83767c63c564952975777eed7d290393',
      callbackURL : 'http://localhost.xip.io:3000/host/auth/facebook/callback'
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
