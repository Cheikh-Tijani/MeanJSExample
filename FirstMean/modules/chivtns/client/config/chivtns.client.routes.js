(function () {
  'use strict';

  angular
    .module('chivtns')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('chivtns', {
        abstract: true,
        url: '/chivtns',
        template: '<ui-view/>'
      })
      .state('chivtns.list', {
        url: '',
        templateUrl: 'modules/chivtns/client/views/list-chivtns.client.view.html',
        controller: 'ChivtnsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Chivtns List'
        }
      })
      .state('chivtns.create', {
        url: '/create',
        templateUrl: 'modules/chivtns/client/views/form-chivtn.client.view.html',
        controller: 'ChivtnsController',
        controllerAs: 'vm',
        resolve: {
          chivtnResolve: newChivtn
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Chivtns Create'
        }
      })
      .state('chivtns.edit', {
        url: '/:chivtnId/edit',
        templateUrl: 'modules/chivtns/client/views/form-chivtn.client.view.html',
        controller: 'ChivtnsController',
        controllerAs: 'vm',
        resolve: {
          chivtnResolve: getChivtn
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Chivtn {{ chivtnResolve.name }}'
        }
      })
      .state('chivtns.view', {
        url: '/:chivtnId',
        templateUrl: 'modules/chivtns/client/views/view-chivtn.client.view.html',
        controller: 'ChivtnsController',
        controllerAs: 'vm',
        resolve: {
          chivtnResolve: getChivtn
        },
        data: {
          pageTitle: 'Chivtn {{ chivtnResolve.name }}'
        }
      });
  }

  getChivtn.$inject = ['$stateParams', 'ChivtnsService'];

  function getChivtn($stateParams, ChivtnsService) {
    return ChivtnsService.get({
      chivtnId: $stateParams.chivtnId
    }).$promise;
  }

  newChivtn.$inject = ['ChivtnsService'];

  function newChivtn(ChivtnsService) {
    return new ChivtnsService();
  }
}());
