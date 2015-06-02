var Firebase = require('firebase');
var dBRef = new Firebase('https://dazzling-heat-1012.firebaseio.com');

// Helper methods
var defaultCb = function(message) {
  message = message || 'Failed to access database';
  return function(err) {
    if (err) {
      console.error(message, err);
    }
  };
};
// Provides an easier way to access the desired reference
var sessionsRef = function(userInfo) {
  return dBRef.child(userInfo.provider).child(userInfo.hostId).child('sessions');
};
var sessionRef = function(sessionInfo) {
  return sessionsRef(sessionInfo).child(sessionInfo.sessionId);
};
// Ensures that the appropriate parameters are present
var validateUser = function(userInfo) {
  return userInfo && userInfo.provider && userInfo.hostId;
};
var validateSession = function(sessionInfo) {
  return validateUser(sessionInfo) && sessionInfo.sessionId;
};
// Turns a firebase object of children into an ordered array with the desired criteria
var gatherChildren = function(ref, numChildren, addToResults, allDone) {
  var remaining = numChildren;
  var results = [];

  // Called once for each child_added event, fires when all are complete
  var oneDone = function() {
    remaining--;
    if (!remaining) {
      ref.orderByKey().off('child_added', onChildAdded);
      allDone(null, results);
    }
  };
  // Edge case of no votes where oneDone would never be called otherwise
  if (!remaining) {
    remaining++;
    oneDone();
  }

  var onChildAdded = ref.orderByKey().on('child_added', function(snapshot) {
      addToResults(results, snapshot);
      oneDone();
    }, function (errorObject) {
      return allDone('Reading from db failed: ' + errorObject.code);
  });
};

// Opens a new session when created by the host
exports.openSessionInDb =function(sessionInfo, cb) {

  if(!validateSession(sessionInfo)) {
    return;
  }
  cb = cb || defaultCb('Failed to open session');
  sessionRef(sessionInfo).set({
    startTime: Firebase.ServerValue.TIMESTAMP,
    interval: sessionInfo.interval
  }, cb);
};

// Adds an endTime property to sessionInfo object
exports.closeSessionInDb = function(sessionInfo, cb) {
  if(!validateSession(sessionInfo)) {
    return;
  }
  cb = cb || defaultCb('Failed to close session');
  sessionRef(sessionInfo).update({
    endTime: Firebase.ServerValue.TIMESTAMP,
    weightedAverage: sessionInfo.weightedAverage,
    userCount: sessionInfo.userCount
  }, cb);
};

// Adds votes into the database for an existing session
exports.addToDb = function(sessionInfo, voteInfo, cb) {
  if(!validateSession(sessionInfo)) {
    return;
  }
  voteInfo.testing = 'hello';
  cb = cb || defaultCb('Failed to add entry');
  // writes votes to database
  sessionRef(sessionInfo).child('votes').push(voteInfo, cb);
};

exports.addQuestionToDb = function(question, cb) {
  cb = cb || defaultCb('Failed to add question');
  dBRef.child('questions').push(question);
};

exports.getQuestions = function(cb) {
  dBRef.child("questions").once("value", function(questions) {
    var results = questions.val();
    dBRef.child("questions").off("value");
    cb(results);
  });
};

exports.deleteSessionFromDb = function(userInfo, sessionId, cb) {
  dBRef.child(userInfo.provider).child(userInfo.hostId).child('sessions').child(sessionId).set(null);
  cb();
};

exports.getSessionsFromDb = function(userInfo, cb) {
  cb = cb || defaultCb('Failed to retrieve sessions');
  if(!validateUser(userInfo)) {
    return cb('getSessionsFromDb failed: userInfo params not specified');
  }

  sessionsRef(userInfo).once('value', function(snapshot) {
      if (snapshot.val()) {
        gatherChildren(sessionsRef(userInfo), Object.keys(snapshot.val()).length, function(results, snapshot) {
          var session = snapshot.val();
          results.unshift({
            sessionId: snapshot.key(),
            startTime: session.startTime,

            // These values are undefined if the session is not yet closed
            duration: session.endTime ? session.endTime - session.startTime : undefined,
            weightedAverage: session.weightedAverage,
            userCount: session.userCount
          });
        }, cb);
      } else {
        cb(null, {});
      }
    }, function (errorObject) {
      return cb('Reading from db failed: ' + errorObject.code);
  });

};

exports.getSessionFromDb = function(sessionInfo, cb) {
  cb = cb || defaultCb('Failed to retrieve session data');
  if(!validateSession(sessionInfo)) {
    return cb('getSessionFromDb failed: sessionInfo params not specified');
  }

  sessionRef(sessionInfo).once('value', function(snapshot) {
      var sessionObj = snapshot.val();
      gatherChildren(sessionRef(sessionInfo).child('votes'), Object.keys(sessionObj.votes).length, function(results, snapshot) {
          results.push(snapshot.val());
        }, function(err, data) {
          sessionObj.votes = data;
          cb(err, sessionObj);
      });
    }, function (errorObject) {
      return cb('Reading from db failed: ' + errorObject.code);
  });
};

// Firebase creates the user if entry does not exist
exports.updateUser = function(provider, profile, cb) {
  cb = cb || defaultCb('Failed to create user');
  dBRef.child(provider).child(profile.id).update({displayName:profile.displayName}, cb);
};

// Switches to a new ref for testing purposes
exports._changeRef = function(newRef) {
  dBRef = newRef || dBRef;
};
