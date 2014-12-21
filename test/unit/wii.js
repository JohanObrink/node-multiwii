/*jshint expr: true*/

var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  Wii = require('../../');

chai.use(require('sinon-chai'));

describe('\u2b50  MultiWii', function () {


  var serialport, sandbox, port, proxyConnection;
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


    describe('#onError', function () {
      it('emits error', function () {
        var wii = new Wii(proxyConnection);
        var listener = sinon.spy();
        wii.on('error', listener);
        var err = new Error();
        proxyConnection.on.withArgs('error').yield(err);
        expect(listener).calledOnce;
      });
    });
  });



// --

    // describe('#onOpen', function () {
    //   var wii, _onConnect;

    //   beforeEach(function () {
    //     wii = new Wii();
    //     wii.connect('/dev/derp');
    //     _onConnect = wii._onConnect;
    //     port.on.withArgs('open').yield();
    //   });

    //   it('sets connected property to true', function () {
    //     expect(wii.connected).to.be.true;
    //   });

    //   it('adds listener for data', function () {
    //     expect(port.on.withArgs('data')).calledOnce;
    //   });

    //   it('clears and removes connect listener', function () {
    //     expect(port.removeListener).calledWith('open', _onConnect);
    //     expect(wii._onConnect).to.not.exist;
    //   });


    //   describe('\u26a1 disconnect', function () {
    //     var listener;

    //     beforeEach(function () {
    //       listener = sinon.spy();
    //       wii.on('disconnect', listener);
    //       port.on.withArgs('error').yield({ errno: -1, code: 'UNKNOWN' });
    //     });

    //     it('emits disconnect', function () {
    //       expect(listener).calledOnce;
    //     });
    //     it('sets connected to false', function () {
    //       expect(wii.connected).to.be.false;
    //     });
    //     it('clears listeners', function () {
    //       expect(port.removeListener).calledWith('error', wii.onError);
    //       expect(port.removeListener).calledWith('data', wii.onData);
    //     });
    //   });

    //   describe('\u26a1 data', function () {
    //     var listener;

    //     beforeEach(function () {
    //       listener = sinon.spy();
    //       wii.on('data', listener);
    //     });

    //     it('emits raw data', function () {
    //       var buffer = new Buffer([0xff, 0xfe]);
    //       port.on.withArgs('data').yield(buffer);
    //       expect(listener).calledOnce;
    //       expect(listener).calledWith(buffer);
    //     });
    //   });

    //   describe('#send', function () {
    //     it('sends out messages correctly', function () {
    //       wii.send(105);
    //       var expected = Array.prototype.slice.call(new Buffer([0x24, 0x4D, 0x3C, 0, 105, 105, 0]));
    //       var sent = Array.prototype.slice.call(port.write.getCall(0).args[0]);

    //       expect(sent).to.eql(expected);
    //     });
    //   });

    //   describe('#calculateChecksum', function () {
    //     it('can calculate the checksum', function () {
    //       var buffer = new Buffer(40);
    //       var data = new Buffer([0x24, 0x4d, 0x3e, 0x0a, 0x65, 0x28, 0x0b, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x00, 0x00]);
    //       data.copy(buffer, 0);
    //       var checksum = wii.calculateChecksum(buffer);
    //       expect(checksum).to.equal(0x6d);
    //     });
    //     it('can calculate another checksum', function () {
    //       var buffer = new Buffer(40);
    //       var data = new Buffer([0x24, 0x4D, 0x3C, 0, 105]);
    //       data.copy(buffer, 0);
    //       var checksum = wii.calculateChecksum(buffer);
    //       expect(checksum).to.equal(105);
    //     });
    //   });

    // });
  // });
});