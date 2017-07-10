(function () {
  'use strict';

  describe('Chivtns Route Tests', function () {
    // Initialize global variables
    var $scope,
      ChivtnsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ChivtnsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ChivtnsService = _ChivtnsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('chivtns');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/chivtns');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ChivtnsController,
          mockChivtn;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('chivtns.view');
          $templateCache.put('modules/chivtns/client/views/view-chivtn.client.view.html', '');

          // create mock Chivtn
          mockChivtn = new ChivtnsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Chivtn Name'
          });

          // Initialize Controller
          ChivtnsController = $controller('ChivtnsController as vm', {
            $scope: $scope,
            chivtnResolve: mockChivtn
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:chivtnId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.chivtnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            chivtnId: 1
          })).toEqual('/chivtns/1');
        }));

        it('should attach an Chivtn to the controller scope', function () {
          expect($scope.vm.chivtn._id).toBe(mockChivtn._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/chivtns/client/views/view-chivtn.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ChivtnsController,
          mockChivtn;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('chivtns.create');
          $templateCache.put('modules/chivtns/client/views/form-chivtn.client.view.html', '');

          // create mock Chivtn
          mockChivtn = new ChivtnsService();

          // Initialize Controller
          ChivtnsController = $controller('ChivtnsController as vm', {
            $scope: $scope,
            chivtnResolve: mockChivtn
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.chivtnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/chivtns/create');
        }));

        it('should attach an Chivtn to the controller scope', function () {
          expect($scope.vm.chivtn._id).toBe(mockChivtn._id);
          expect($scope.vm.chivtn._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/chivtns/client/views/form-chivtn.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ChivtnsController,
          mockChivtn;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('chivtns.edit');
          $templateCache.put('modules/chivtns/client/views/form-chivtn.client.view.html', '');

          // create mock Chivtn
          mockChivtn = new ChivtnsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Chivtn Name'
          });

          // Initialize Controller
          ChivtnsController = $controller('ChivtnsController as vm', {
            $scope: $scope,
            chivtnResolve: mockChivtn
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:chivtnId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.chivtnResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            chivtnId: 1
          })).toEqual('/chivtns/1/edit');
        }));

        it('should attach an Chivtn to the controller scope', function () {
          expect($scope.vm.chivtn._id).toBe(mockChivtn._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/chivtns/client/views/form-chivtn.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
