(function () {
  'use strict';

  angular
    .module('chivtns')
    .controller('ChivtnsListController', ChivtnsListController);

  ChivtnsListController.$inject = ['ChivtnsService'];

  function ChivtnsListController(ChivtnsService) {
    var vm = this;

    vm.chivtns = ChivtnsService.query();
  }
}());
