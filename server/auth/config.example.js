module.exports = {
  facebookAuth : {
    prod: {
      clientID : '923763767673641', // Your App ID
      clientSecret : '1c96e6fc51065297a9ff8cef8c1e161c', // Your App Secret
      callbackURL : 'http://127.0.0.1.xip.io:3000/host/auth/facebook/callback'
    },
    dev: {
      clientID : '923763767673641',
      clientSecret : '1c96e6fc51065297a9ff8cef8c1e161c',
      callbackURL : 'http://127.0.0.1.xip.io:3000/host/auth/facebook/callback'
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
