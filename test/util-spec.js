(() => {

  const expect = chai.expect;

  const require = __modules.__require;

  const UtilMethods = require('util/util_methods');

  describe('UtilMethods type check methods', function() {
    console.log("mrc");

    const util = UtilMethods.new();
    it('isFloat works as expected', done => {
      expect(util.isFloat('foo')).to.be.false;
      expect(util.isFloat(12.345)).to.be.true;
      expect(util.isFloat(12)).to.be.false;
      expect(util.isFloat('12.345')).to.be.false;
      expect(util.isFloat(3 / 3)).to.be.false;
      expect(util.isFloat(1 - 1.5)).to.be.true;
      done();
    });
    it('isntFloat works as expected', done => {
      expect(util.isntFloat('foo')).to.be.true;
      expect(util.isntFloat(12.345)).to.be.false;
      expect(util.isntFloat(12)).to.be.true;
      expect(util.isntFloat('12.345')).to.be.true;
      expect(util.isntFloat(3 / 3)).to.be.true;
      expect(util.isntFloat(1 - 1.5)).to.be.false;
      done();
    });
    it('isNumber works as expected', done => {
      expect(util.isNumber('foo')).to.be.false;
      expect(util.isNumber(12.345)).to.be.true;
      expect(util.isNumber(12)).to.be.true;
      expect(util.isNumber('12.345')).to.be.false;
      expect(util.isNumber(3 / 3)).to.be.true;
      expect(util.isNumber(1 - 1.5)).to.be.true;
      done();
    });
    it('isntNumber works as expected', done => {
      expect(util.isntNumber('foo')).to.be.true;
      expect(util.isntNumber(12.345)).to.be.false;
      expect(util.isntNumber(12)).to.be.false;
      expect(util.isntNumber('12.345')).to.be.true;
      expect(util.isntNumber(3 / 3)).to.be.false;
      expect(util.isntNumber(1 - 1.5)).to.be.false;
      done();
    });
    it('isInteger works as expected', done => {
      expect(util.isInteger('foo')).to.be.false;
      expect(util.isInteger(12.345)).to.be.false;
      expect(util.isInteger(12)).to.be.true;
      expect(util.isInteger('12.345')).to.be.false;
      expect(util.isInteger(3 / 3)).to.be.true;
      expect(util.isInteger(1 - 1.5)).to.be.false;
      done();
    });
    it('isntInteger works as expected', done => {
      expect(util.isntInteger('foo')).to.be.true;
      expect(util.isntInteger(12.345)).to.be.true;
      expect(util.isntInteger(12)).to.be.false;
      expect(util.isntInteger('12.345')).to.be.true;
      expect(util.isntInteger(3 / 3)).to.be.false;
      expect(util.isntInteger(1 - 1.5)).to.be.true;
      done();
    });

  });

})();
