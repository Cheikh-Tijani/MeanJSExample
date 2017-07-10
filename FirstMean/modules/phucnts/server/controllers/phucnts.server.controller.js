'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Phucnt = mongoose.model('Phucnt'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Phucnt
 */
exports.create = function(req, res) {
  var phucnt = new Phucnt(req.body);
  phucnt.user = req.user;

  phucnt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phucnt);
    }
  });
};

/**
 * Show the current Phucnt
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var phucnt = req.phucnt ? req.phucnt.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  phucnt.isCurrentUserOwner = req.user && phucnt.user && phucnt.user._id.toString() === req.user._id.toString();

  res.jsonp(phucnt);
};

/**
 * Update a Phucnt
 */
exports.update = function(req, res) {
  var phucnt = req.phucnt;

  phucnt = _.extend(phucnt, req.body);

  phucnt.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phucnt);
    }
  });
};

/**
 * Delete an Phucnt
 */
exports.delete = function(req, res) {
  var phucnt = req.phucnt;

  phucnt.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phucnt);
    }
  });
};

/**
 * List of Phucnts
 */
exports.list = function(req, res) {
  Phucnt.find().sort('-created').populate('user', 'displayName').exec(function(err, phucnts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phucnts);
    }
  });
};

/**
 * Phucnt middleware
 */
exports.phucntByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Phucnt is invalid'
    });
  }

  Phucnt.findById(id).populate('user', 'displayName').exec(function (err, phucnt) {
    if (err) {
      return next(err);
    } else if (!phucnt) {
      return res.status(404).send({
        message: 'No Phucnt with that identifier has been found'
      });
    }
    req.phucnt = phucnt;
    next();
  });
};
