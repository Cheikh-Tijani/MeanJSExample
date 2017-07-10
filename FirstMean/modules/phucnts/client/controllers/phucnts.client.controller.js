(function () {
  'use strict';

  // Phucnts controller
  angular
    .module('phucnts')
    .controller('PhucntsController', PhucntsController);

  PhucntsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'phucntResolve'];

  function PhucntsController ($scope, $state, $window, Authentication, phucnt) {
    var vm = this;

    vm.authentication = Authentication;
    vm.phucnt = phucnt;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Phucnt
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.phucnt.$remove($state.go('phucnts.list'));
      }
    }

    // Save Phucnt
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.phucntForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.phucnt._id) {
        vm.phucnt.$update(successCallback, errorCallback);
      } else {
        vm.phucnt.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('phucnts.view', {
          phucntId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
