(function () {
  'use strict';

  angular
    .module('chivtns')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Chivtns',
      state: 'chivtns',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'chivtns', {
      title: 'List Chivtns',
      state: 'chivtns.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'chivtns', {
      title: 'Create Chivtn',
      state: 'chivtns.create',
      roles: ['user']
    });
  }
}());
