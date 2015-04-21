var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var Firebase = require('firebase');
var dbUtils = require('../../server/utils/dbUtils');

describe('dbUtils', function() {
  // Test with a different Firebase instance
  var sessionRef = new Firebase('https://amber-fire-3990.firebaseio.com/');
  dbUtils._changeRef(sessionRef);
  var sessionInfo = {
    provider: 'facebook',
    hostId: 'abc',
    sessionId: 'c22',
    interval: 2000,
    weightedAverage: 2.2,
    userCount: 10
  };
  var sessionInfo2 = {
    provider: 'facebook',
    hostId: 'abc',
    sessionId: 'c28',
    interval: 2000,
    weightedAverage: -1.1,
    userCount: 20
  };
  var voteInfo = {
    guestId: 'bcd',
    voteVal: 2,
    timeStep: 1
  };
  var voteInfo2 = {
    guestId: 'cde',
    voteVal: 0,
    timeStep: 3
  };

  // All values are changed before any values are read
  before(function(done) {
    this.timeout(10000);
    sessionRef.set({}, function(err) {
      if (err) {
        console.error(err);
      }
      else {
        dbUtils.updateUser(sessionInfo.provider, {id: sessionInfo.hostId, displayName: 'Dan Stemkoski'}, function(err) {
          if (err) {
            console.error(err);
          }
          else {
            dbUtils.openSessionInDb(sessionInfo, function(err) {
              if (err) {
                console.error(err);
              }
              else {
                dbUtils.addToDb(sessionInfo, voteInfo, function(err) {
                  if (err) {
                    console.error(err);
                  }
                  else {
                    dbUtils.addToDb(sessionInfo, voteInfo2, function(err) {
                      if (err) {
                        console.error(err);
                      }
                      else {
                        dbUtils.closeSessionInDb(sessionInfo, function(err) {
                          if (err) {
                            console.error(err);
                          }
                          else {
                            dbUtils.openSessionInDb(sessionInfo2, function(err) {
                              if (err) {
                                console.error(err);
                              }
                              else {
                                dbUtils.closeSessionInDb(sessionInfo2, function(err) {
                                  if (err) {
                                    console.error(err);
                                  }
                                  else {
                                    done();
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  it('creates a new user', function(done) {
    sessionRef.child('facebook').child('abc').child('displayName').once('value', function(snapshot) {
      expect(snapshot.val()).to.equal('Dan Stemkoski');
      done();
    });
  });
  it('creates a new session', function(done) {
    sessionRef.child('facebook').child('abc').child('sessions').child('c22').child('startTime').once('value', function(snapshot) {
      expect(snapshot.val()).to.be.a('number');
      done();
    });
  });
  it('adds entries to a session', function(done) {
    sessionRef.child('facebook').child('abc').child('sessions').child('c22').child('votes').once('value', function(snapshot) {
      var votesObj = snapshot.val();
      var votesArray = Object.keys(votesObj).map(function(key) {
        return votesObj[key];
      });
      if (votesArray[0].guestId === voteInfo.guestId) {
        expect(votesArray).to.deep.equal([voteInfo, voteInfo2]);
      } else {
        expect(votesArray).to.deep.equal([voteInfo2, voteInfo]);
      }
      done();
    });
  });
  it('closes an existing session', function(done) {
    sessionRef.child('facebook').child('abc').child('sessions').child('c22').child('endTime').once('value', function(snapshot) {
      expect(snapshot.val()).to.be.a('number');
      done();
    });
  });
  it('retrieves sessions from the database', function(done) {
    dbUtils.getSessionsFromDb({provider: 'facebook', hostId: 'abc'}, function(err, data) {
      expect(data).to.be.an('array');
      expect(data.length).to.equal(2);
      expect(data[0].startTime).to.be.a('number');
      expect(data[0].startTime > data[1].startTime).to.equal(true);
      expect(data[0].sessionId).to.be.a('string');
      expect(data[0].weightedAverage).to.be.a('number');
      done();
    });
  });
  it('gets session data from the database', function(done) {
    dbUtils.getSessionFromDb(sessionInfo, function(err, data) {
      expect(data.startTime).to.be.a('number');
      expect(data.endTime).to.be.a('number');
      expect(data.interval).to.be.a('number');
      expect(data.weightedAverage).to.be.a('number');
      expect(data.userCount).to.be.a('number');
      expect(data.votes).to.deep.equal([voteInfo, voteInfo2]);
      done();
    });
  });
});
