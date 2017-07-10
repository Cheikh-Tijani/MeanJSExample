(function () {
  'use strict';

  angular
    .module('phucnts')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Phucnts',
      state: 'phucnts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'phucnts', {
      title: 'List Phucnts',
      state: 'phucnts.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'phucnts', {
      title: 'Create Phucnt',
      state: 'phucnts.create',
      roles: ['user']
    });
  }
}());
