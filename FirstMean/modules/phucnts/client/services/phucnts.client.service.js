// Phucnts service used to communicate Phucnts REST endpoints
(function () {
  'use strict';

  angular
    .module('phucnts')
    .factory('PhucntsService', PhucntsService);

  PhucntsService.$inject = ['$resource'];

  function PhucntsService($resource) {
    return $resource('api/phucnts/:phucntId', {
      phucntId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
