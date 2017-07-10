'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Phucnt = mongoose.model('Phucnt'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  phucnt;

/**
 * Phucnt routes tests
 */
describe('Phucnt CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Phucnt
    user.save(function () {
      phucnt = {
        name: 'Phucnt name'
      };

      done();
    });
  });

  it('should be able to save a Phucnt if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phucnt
        agent.post('/api/phucnts')
          .send(phucnt)
          .expect(200)
          .end(function (phucntSaveErr, phucntSaveRes) {
            // Handle Phucnt save error
            if (phucntSaveErr) {
              return done(phucntSaveErr);
            }

            // Get a list of Phucnts
            agent.get('/api/phucnts')
              .end(function (phucntsGetErr, phucntsGetRes) {
                // Handle Phucnts save error
                if (phucntsGetErr) {
                  return done(phucntsGetErr);
                }

                // Get Phucnts list
                var phucnts = phucntsGetRes.body;

                // Set assertions
                (phucnts[0].user._id).should.equal(userId);
                (phucnts[0].name).should.match('Phucnt name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Phucnt if not logged in', function (done) {
    agent.post('/api/phucnts')
      .send(phucnt)
      .expect(403)
      .end(function (phucntSaveErr, phucntSaveRes) {
        // Call the assertion callback
        done(phucntSaveErr);
      });
  });

  it('should not be able to save an Phucnt if no name is provided', function (done) {
    // Invalidate name field
    phucnt.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phucnt
        agent.post('/api/phucnts')
          .send(phucnt)
          .expect(400)
          .end(function (phucntSaveErr, phucntSaveRes) {
            // Set message assertion
            (phucntSaveRes.body.message).should.match('Please fill Phucnt name');

            // Handle Phucnt save error
            done(phucntSaveErr);
          });
      });
  });

  it('should be able to update an Phucnt if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phucnt
        agent.post('/api/phucnts')
          .send(phucnt)
          .expect(200)
          .end(function (phucntSaveErr, phucntSaveRes) {
            // Handle Phucnt save error
            if (phucntSaveErr) {
              return done(phucntSaveErr);
            }

            // Update Phucnt name
            phucnt.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Phucnt
            agent.put('/api/phucnts/' + phucntSaveRes.body._id)
              .send(phucnt)
              .expect(200)
              .end(function (phucntUpdateErr, phucntUpdateRes) {
                // Handle Phucnt update error
                if (phucntUpdateErr) {
                  return done(phucntUpdateErr);
                }

                // Set assertions
                (phucntUpdateRes.body._id).should.equal(phucntSaveRes.body._id);
                (phucntUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Phucnts if not signed in', function (done) {
    // Create new Phucnt model instance
    var phucntObj = new Phucnt(phucnt);

    // Save the phucnt
    phucntObj.save(function () {
      // Request Phucnts
      request(app).get('/api/phucnts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Phucnt if not signed in', function (done) {
    // Create new Phucnt model instance
    var phucntObj = new Phucnt(phucnt);

    // Save the Phucnt
    phucntObj.save(function () {
      request(app).get('/api/phucnts/' + phucntObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', phucnt.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Phucnt with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/phucnts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Phucnt is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Phucnt which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Phucnt
    request(app).get('/api/phucnts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Phucnt with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Phucnt if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phucnt
        agent.post('/api/phucnts')
          .send(phucnt)
          .expect(200)
          .end(function (phucntSaveErr, phucntSaveRes) {
            // Handle Phucnt save error
            if (phucntSaveErr) {
              return done(phucntSaveErr);
            }

            // Delete an existing Phucnt
            agent.delete('/api/phucnts/' + phucntSaveRes.body._id)
              .send(phucnt)
              .expect(200)
              .end(function (phucntDeleteErr, phucntDeleteRes) {
                // Handle phucnt error error
                if (phucntDeleteErr) {
                  return done(phucntDeleteErr);
                }

                // Set assertions
                (phucntDeleteRes.body._id).should.equal(phucntSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Phucnt if not signed in', function (done) {
    // Set Phucnt user
    phucnt.user = user;

    // Create new Phucnt model instance
    var phucntObj = new Phucnt(phucnt);

    // Save the Phucnt
    phucntObj.save(function () {
      // Try deleting Phucnt
      request(app).delete('/api/phucnts/' + phucntObj._id)
        .expect(403)
        .end(function (phucntDeleteErr, phucntDeleteRes) {
          // Set message assertion
          (phucntDeleteRes.body.message).should.match('User is not authorized');

          // Handle Phucnt error error
          done(phucntDeleteErr);
        });

    });
  });

  it('should be able to get a single Phucnt that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Phucnt
          agent.post('/api/phucnts')
            .send(phucnt)
            .expect(200)
            .end(function (phucntSaveErr, phucntSaveRes) {
              // Handle Phucnt save error
              if (phucntSaveErr) {
                return done(phucntSaveErr);
              }

              // Set assertions on new Phucnt
              (phucntSaveRes.body.name).should.equal(phucnt.name);
              should.exist(phucntSaveRes.body.user);
              should.equal(phucntSaveRes.body.user._id, orphanId);

              // force the Phucnt to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Phucnt
                    agent.get('/api/phucnts/' + phucntSaveRes.body._id)
                      .expect(200)
                      .end(function (phucntInfoErr, phucntInfoRes) {
                        // Handle Phucnt error
                        if (phucntInfoErr) {
                          return done(phucntInfoErr);
                        }

                        // Set assertions
                        (phucntInfoRes.body._id).should.equal(phucntSaveRes.body._id);
                        (phucntInfoRes.body.name).should.equal(phucnt.name);
                        should.equal(phucntInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Phucnt.remove().exec(done);
    });
  });
});
