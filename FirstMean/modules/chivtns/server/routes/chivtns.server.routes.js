'use strict';

/**
 * Module dependencies
 */
var chivtnsPolicy = require('../policies/chivtns.server.policy'),
  chivtns = require('../controllers/chivtns.server.controller');

module.exports = function(app) {
  // Chivtns Routes
  app.route('/api/chivtns').all(chivtnsPolicy.isAllowed)
    .get(chivtns.list)
    .post(chivtns.create);

  app.route('/api/chivtns/:chivtnId').all(chivtnsPolicy.isAllowed)
    .get(chivtns.read)
    .put(chivtns.update)
    .delete(chivtns.delete);

  // Finish by binding the Chivtn middleware
  app.param('chivtnId', chivtns.chivtnByID);
};
