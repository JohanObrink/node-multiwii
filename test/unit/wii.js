var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('MultiWii', function () {
  var Wii, serialport;
  beforeEach(function () {
    serialport = {
      list: sinon.spy()
    };
    Wii = proxyquire('../../lib/wii', {
      'serialport': serialport
    });
  });
  it('returns a reference to Wii', function () {
    expect(Wii).to.be.a('function');
    expect(new Wii()).to.instanceof(Wii);
  });
  describe('constructor', function () {
    it('sets option values from arg obj', function () {
      var wii = new Wii({port:'/dev/device'});
      expect(wii.options.port).to.equal('/dev/device');
    });
    it('sets option port from arg string', function () {
      var wii = new Wii('/dev/device');
      expect(wii.options.port).to.equal('/dev/device');
    });
  });
  describe('Wii.list', function () {
    it('calls serialport to list available devices', function () {
      var listener = sinon.spy();
      Wii.list(listener);
      expect(serialport.list).calledOnce;
      expect(serialport.list).calledWith(listener);
    });
  });
  describe('#connect', function () {
    it('uses passed in options');
  });
});