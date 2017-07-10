(function () {
  'use strict';

  angular
    .module('phucnts')
    .controller('PhucntsListController', PhucntsListController);

  PhucntsListController.$inject = ['PhucntsService'];

  function PhucntsListController(PhucntsService) {
    var vm = this;

    vm.phucnts = PhucntsService.query();
  }
}());
