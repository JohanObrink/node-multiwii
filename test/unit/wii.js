/*jshint expr: true*/

var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  Wii = require('../../');

chai.use(require('sinon-chai'));

describe('\u2b50  MultiWii', function () {


  var sandbox, proxyConnection, proxyConnection;
  beforeEach(function () {
    proxyConnection = {
      on: sinon.stub(),
      removeListener: sinon.stub(),
      write: sinon.stub(),
      close: sinon.spy()
    };
    sandbox = sinon.sandbox.create();
    sandbox.stub(process, 'nextTick').yields();
  });
  afterEach(function () {
    sandbox.restore();
  });

  it('returns a reference to Wii', function () {
    expect(Wii).to.be.a('function');
    expect(new Wii(proxyConnection)).to.instanceof(Wii);
  });

  describe('constructor', function () {
    it('sets socket from args obj', function () {
      var wii = new Wii(proxyConnection);
      expect(wii.socket).to.equal(proxyConnection);
    });
    it('throws an error if no socket is specified', function () {

      expect(function () { var wii = new Wii(); }).to.throw(Error, /Connection must be provided/);
    });

    it('adds listeners', function () {
      var wii = new Wii(proxyConnection);
      expect(proxyConnection.on.withArgs('error')).calledOnce;
      expect(proxyConnection.on.withArgs('data')).calledOnce;
    });

    it('sets connected property to true', function () {
      var wii = new Wii(proxyConnection);
      expect(wii.connected).to.be.true;
    });

  });

  describe('with communication established', function () {
    var wii;
    beforeEach(function () {
      wii = new Wii(proxyConnection);
    });
    afterEach(function () {
      delete wii;
    });

    describe('\u26a1 data', function () {
      var listener;

      beforeEach(function () {
        listener = sinon.spy();
        wii.on('data', listener);
      });

      it('emits raw data', function () {
        var buffer = new Buffer([0xff, 0xfe]);
        proxyConnection.on.withArgs('data').yield(buffer);
        expect(listener).calledOnce;
        expect(listener).calledWith(buffer);
      });
    });

    describe('#onError', function () {
      var listener;

      beforeEach(function () {
        listener = sinon.spy();
        wii.on('error', listener);
      });

      it('emits error', function () {
        var err = new Error();
        proxyConnection.on.withArgs('error').yield(err);
        expect(listener).calledOnce;
      });
    });



    describe('#send', function () {
      it('sends out messages correctly', function () {
        wii.send(105);
        var expected = Array.prototype.slice.call(new Buffer([0x24, 0x4D, 0x3C, 0, 105, 105, 0]));
        var sent = Array.prototype.slice.call(proxyConnection.write.getCall(0).args[0]);
        expect(sent).to.eql(expected);
      });
    });


    describe('#calculateChecksum', function () {
      it('can calculate the checksum', function () {
        var buffer = new Buffer(40);
        var data = new Buffer([0x24, 0x4d, 0x3e, 0x0a, 0x65, 0x28, 0x0b, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x00, 0x00]);
        data.copy(buffer, 0);
        var checksum = wii.calculateChecksum(buffer);
        expect(checksum).to.equal(0x6d);
      });
      it('can calculate another checksum', function () {
        var buffer = new Buffer(40);
        var data = new Buffer([0x24, 0x4D, 0x3C, 0, 105]);
        data.copy(buffer, 0);
        var checksum = wii.calculateChecksum(buffer);
        expect(checksum).to.equal(105);
      });
    });

  });



});