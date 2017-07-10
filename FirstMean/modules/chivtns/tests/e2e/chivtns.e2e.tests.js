'use strict';

describe('Chivtns E2E Tests:', function () {
  describe('Test Chivtns page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/chivtns');
      expect(element.all(by.repeater('chivtn in chivtns')).count()).toEqual(0);
    });
  });
});
