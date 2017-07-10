(function () {
  'use strict';

  angular
    .module('phucnts')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('phucnts', {
        abstract: true,
        url: '/phucnts',
        template: '<ui-view/>'
      })
      .state('phucnts.list', {
        url: '',
        templateUrl: 'modules/phucnts/client/views/list-phucnts.client.view.html',
        controller: 'PhucntsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Phucnts List'
        }
      })
      .state('phucnts.create', {
        url: '/create',
        templateUrl: 'modules/phucnts/client/views/form-phucnt.client.view.html',
        controller: 'PhucntsController',
        controllerAs: 'vm',
        resolve: {
          phucntResolve: newPhucnt
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Phucnts Create'
        }
      })
      .state('phucnts.edit', {
        url: '/:phucntId/edit',
        templateUrl: 'modules/phucnts/client/views/form-phucnt.client.view.html',
        controller: 'PhucntsController',
        controllerAs: 'vm',
        resolve: {
          phucntResolve: getPhucnt
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Phucnt {{ phucntResolve.name }}'
        }
      })
      .state('phucnts.view', {
        url: '/:phucntId',
        templateUrl: 'modules/phucnts/client/views/view-phucnt.client.view.html',
        controller: 'PhucntsController',
        controllerAs: 'vm',
        resolve: {
          phucntResolve: getPhucnt
        },
        data: {
          pageTitle: 'Phucnt {{ phucntResolve.name }}'
        }
      });
  }

  getPhucnt.$inject = ['$stateParams', 'PhucntsService'];

  function getPhucnt($stateParams, PhucntsService) {
    return PhucntsService.get({
      phucntId: $stateParams.phucntId
    }).$promise;
  }

  newPhucnt.$inject = ['PhucntsService'];

  function newPhucnt(PhucntsService) {
    return new PhucntsService();
  }
}());
