'use strict';

/**
 * Module dependencies
 */
var phucntsPolicy = require('../policies/phucnts.server.policy'),
  phucnts = require('../controllers/phucnts.server.controller');

module.exports = function(app) {
  // Phucnts Routes
  app.route('/api/phucnts').all(phucntsPolicy.isAllowed)
    .get(phucnts.list)
    .post(phucnts.create);

  app.route('/api/phucnts/:phucntId').all(phucntsPolicy.isAllowed)
    .get(phucnts.read)
    .put(phucnts.update)
    .delete(phucnts.delete);

  // Finish by binding the Phucnt middleware
  app.param('phucntId', phucnts.phucntByID);
};
