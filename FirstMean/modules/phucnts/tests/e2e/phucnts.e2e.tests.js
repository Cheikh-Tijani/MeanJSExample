'use strict';

describe('Phucnts E2E Tests:', function () {
  describe('Test Phucnts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/phucnts');
      expect(element.all(by.repeater('phucnt in phucnts')).count()).toEqual(0);
    });
  });
});
