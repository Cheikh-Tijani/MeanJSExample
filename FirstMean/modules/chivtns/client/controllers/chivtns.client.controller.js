(function () {
  'use strict';

  // Chivtns controller
  angular
    .module('chivtns')
    .controller('ChivtnsController', ChivtnsController);

  ChivtnsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'chivtnResolve'];

  function ChivtnsController ($scope, $state, $window, Authentication, chivtn) {
    var vm = this;

    vm.authentication = Authentication;
    vm.chivtn = chivtn;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Chivtn
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.chivtn.$remove($state.go('chivtns.list'));
      }
    }

    // Save Chivtn
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.chivtnForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.chivtn._id) {
        vm.chivtn.$update(successCallback, errorCallback);
      } else {
        vm.chivtn.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('chivtns.view', {
          chivtnId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
