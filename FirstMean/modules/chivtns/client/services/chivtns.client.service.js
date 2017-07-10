// Chivtns service used to communicate Chivtns REST endpoints
(function () {
  'use strict';

  angular
    .module('chivtns')
    .factory('ChivtnsService', ChivtnsService);

  ChivtnsService.$inject = ['$resource'];

  function ChivtnsService($resource) {
    return $resource('api/chivtns/:chivtnId', {
      chivtnId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
