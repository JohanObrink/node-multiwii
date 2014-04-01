/*jshint expr: true*/

var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('\u2b50  messages', function () {
  var Wii, serialport, sandbox, port, wii;
  beforeEach(function () {
    port = {
      on: sinon.stub(),
      removeListener: sinon.stub()
    };
    serialport = {
      list: sinon.stub(),
      parsers: {
        raw: {}
      },
      SerialPort: sinon.stub().returns(port)
    };
    Wii = proxyquire('../../lib/wii', {
      'serialport': serialport
    });
    sandbox = sinon.sandbox.create();

    wii = new Wii();
    wii.connect('/dev/mupp');
    port.on.withArgs('open').yield();
  });
  afterEach(function () {
    sandbox.restore();
  });

  describe('ident', function () {
    it('parses the message correctly', function () {
      var listener = sinon.spy();
      wii.on('ident', listener);
      port.on.withArgs('data').yield(new Buffer([0, 0, 0, 3, 100, 2, 1, 0]));
      expect(listener).calledWith({
        version: 2,
        multitype: 'TRI',
        subversion: 0
      });
    });
  });

  describe('rc', function () {
    it('sends the read command correctly', function () {
      sinon.stub(wii, 'send');
      wii.read('rc');
      expect(wii.send).calledWith(105);
      wii.send.restore();
    });
    it('parses the message correctly', function () {
      var listener = sinon.spy();
      wii.on('rc', listener);
      port.on.withArgs('data').yield(new Buffer([0, 0, 0, 16, 105,
        0, 1, // roll
        1, 1, // pitch
        2, 1, // yaw
        3, 1, // throttle
        4, 1, // aux1
        5, 1, // aux2
        6, 1, // aux3
        7, 1  // aux4
      ]));
      expect(listener).calledWith({
        roll: 256,
        pitch: 257,
        yaw: 258,
        throttle: 259,
        aux1: 260,
        aux2: 261,
        aux3: 262,
        aux4: 263
      });
    });
  });

  describe('status', function () {
    it('parses the message correctly', function () {
      var listener = sinon.spy();
      wii.on('status', listener);
      port.on.withArgs('data').yield(new Buffer([0, 0, 0, 11, 101,
        0, 1, // cycleTime
        1, 1, // i2cErrorCount
        2, 1, // accBaro
        3, 1, 0, 0 // dafuq
      ]));
      expect(listener).calledWith({
        cycleTime: 256,
        i2cErrorCount: 257,
        accBaro: 258,
        dafuq: 259
      });
    });
  });
  
});