'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Chivtn = mongoose.model('Chivtn'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Chivtn
 */
exports.create = function(req, res) {
  var chivtn = new Chivtn(req.body);
  chivtn.user = req.user;

  chivtn.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chivtn);
    }
  });
};

/**
 * Show the current Chivtn
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var chivtn = req.chivtn ? req.chivtn.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  chivtn.isCurrentUserOwner = req.user && chivtn.user && chivtn.user._id.toString() === req.user._id.toString();

  res.jsonp(chivtn);
};

/**
 * Update a Chivtn
 */
exports.update = function(req, res) {
  var chivtn = req.chivtn;

  chivtn = _.extend(chivtn, req.body);

  chivtn.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chivtn);
    }
  });
};

/**
 * Delete an Chivtn
 */
exports.delete = function(req, res) {
  var chivtn = req.chivtn;

  chivtn.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chivtn);
    }
  });
};

/**
 * List of Chivtns
 */
exports.list = function(req, res) {
  Chivtn.find().sort('-created').populate('user', 'displayName').exec(function(err, chivtns) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chivtns);
    }
  });
};

/**
 * Chivtn middleware
 */
exports.chivtnByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Chivtn is invalid'
    });
  }

  Chivtn.findById(id).populate('user', 'displayName').exec(function (err, chivtn) {
    if (err) {
      return next(err);
    } else if (!chivtn) {
      return res.status(404).send({
        message: 'No Chivtn with that identifier has been found'
      });
    }
    req.chivtn = chivtn;
    next();
  });
};
