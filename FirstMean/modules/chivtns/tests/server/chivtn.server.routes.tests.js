'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Chivtn = mongoose.model('Chivtn'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  chivtn;

/**
 * Chivtn routes tests
 */
describe('Chivtn CRUD tests', function () {

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

    // Save a user to the test db and create new Chivtn
    user.save(function () {
      chivtn = {
        name: 'Chivtn name'
      };

      done();
    });
  });

  it('should be able to save a Chivtn if logged in', function (done) {
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

        // Save a new Chivtn
        agent.post('/api/chivtns')
          .send(chivtn)
          .expect(200)
          .end(function (chivtnSaveErr, chivtnSaveRes) {
            // Handle Chivtn save error
            if (chivtnSaveErr) {
              return done(chivtnSaveErr);
            }

            // Get a list of Chivtns
            agent.get('/api/chivtns')
              .end(function (chivtnsGetErr, chivtnsGetRes) {
                // Handle Chivtns save error
                if (chivtnsGetErr) {
                  return done(chivtnsGetErr);
                }

                // Get Chivtns list
                var chivtns = chivtnsGetRes.body;

                // Set assertions
                (chivtns[0].user._id).should.equal(userId);
                (chivtns[0].name).should.match('Chivtn name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Chivtn if not logged in', function (done) {
    agent.post('/api/chivtns')
      .send(chivtn)
      .expect(403)
      .end(function (chivtnSaveErr, chivtnSaveRes) {
        // Call the assertion callback
        done(chivtnSaveErr);
      });
  });

  it('should not be able to save an Chivtn if no name is provided', function (done) {
    // Invalidate name field
    chivtn.name = '';

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

        // Save a new Chivtn
        agent.post('/api/chivtns')
          .send(chivtn)
          .expect(400)
          .end(function (chivtnSaveErr, chivtnSaveRes) {
            // Set message assertion
            (chivtnSaveRes.body.message).should.match('Please fill Chivtn name');

            // Handle Chivtn save error
            done(chivtnSaveErr);
          });
      });
  });

  it('should be able to update an Chivtn if signed in', function (done) {
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

        // Save a new Chivtn
        agent.post('/api/chivtns')
          .send(chivtn)
          .expect(200)
          .end(function (chivtnSaveErr, chivtnSaveRes) {
            // Handle Chivtn save error
            if (chivtnSaveErr) {
              return done(chivtnSaveErr);
            }

            // Update Chivtn name
            chivtn.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Chivtn
            agent.put('/api/chivtns/' + chivtnSaveRes.body._id)
              .send(chivtn)
              .expect(200)
              .end(function (chivtnUpdateErr, chivtnUpdateRes) {
                // Handle Chivtn update error
                if (chivtnUpdateErr) {
                  return done(chivtnUpdateErr);
                }

                // Set assertions
                (chivtnUpdateRes.body._id).should.equal(chivtnSaveRes.body._id);
                (chivtnUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Chivtns if not signed in', function (done) {
    // Create new Chivtn model instance
    var chivtnObj = new Chivtn(chivtn);

    // Save the chivtn
    chivtnObj.save(function () {
      // Request Chivtns
      request(app).get('/api/chivtns')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Chivtn if not signed in', function (done) {
    // Create new Chivtn model instance
    var chivtnObj = new Chivtn(chivtn);

    // Save the Chivtn
    chivtnObj.save(function () {
      request(app).get('/api/chivtns/' + chivtnObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', chivtn.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Chivtn with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/chivtns/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Chivtn is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Chivtn which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Chivtn
    request(app).get('/api/chivtns/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Chivtn with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Chivtn if signed in', function (done) {
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

        // Save a new Chivtn
        agent.post('/api/chivtns')
          .send(chivtn)
          .expect(200)
          .end(function (chivtnSaveErr, chivtnSaveRes) {
            // Handle Chivtn save error
            if (chivtnSaveErr) {
              return done(chivtnSaveErr);
            }

            // Delete an existing Chivtn
            agent.delete('/api/chivtns/' + chivtnSaveRes.body._id)
              .send(chivtn)
              .expect(200)
              .end(function (chivtnDeleteErr, chivtnDeleteRes) {
                // Handle chivtn error error
                if (chivtnDeleteErr) {
                  return done(chivtnDeleteErr);
                }

                // Set assertions
                (chivtnDeleteRes.body._id).should.equal(chivtnSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Chivtn if not signed in', function (done) {
    // Set Chivtn user
    chivtn.user = user;

    // Create new Chivtn model instance
    var chivtnObj = new Chivtn(chivtn);

    // Save the Chivtn
    chivtnObj.save(function () {
      // Try deleting Chivtn
      request(app).delete('/api/chivtns/' + chivtnObj._id)
        .expect(403)
        .end(function (chivtnDeleteErr, chivtnDeleteRes) {
          // Set message assertion
          (chivtnDeleteRes.body.message).should.match('User is not authorized');

          // Handle Chivtn error error
          done(chivtnDeleteErr);
        });

    });
  });

  it('should be able to get a single Chivtn that has an orphaned user reference', function (done) {
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

          // Save a new Chivtn
          agent.post('/api/chivtns')
            .send(chivtn)
            .expect(200)
            .end(function (chivtnSaveErr, chivtnSaveRes) {
              // Handle Chivtn save error
              if (chivtnSaveErr) {
                return done(chivtnSaveErr);
              }

              // Set assertions on new Chivtn
              (chivtnSaveRes.body.name).should.equal(chivtn.name);
              should.exist(chivtnSaveRes.body.user);
              should.equal(chivtnSaveRes.body.user._id, orphanId);

              // force the Chivtn to have an orphaned user reference
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

                    // Get the Chivtn
                    agent.get('/api/chivtns/' + chivtnSaveRes.body._id)
                      .expect(200)
                      .end(function (chivtnInfoErr, chivtnInfoRes) {
                        // Handle Chivtn error
                        if (chivtnInfoErr) {
                          return done(chivtnInfoErr);
                        }

                        // Set assertions
                        (chivtnInfoRes.body._id).should.equal(chivtnSaveRes.body._id);
                        (chivtnInfoRes.body.name).should.equal(chivtn.name);
                        should.equal(chivtnInfoRes.body.user, undefined);

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
      Chivtn.remove().exec(done);
    });
  });
});
