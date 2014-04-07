/*jshint expr: true*/

var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('\u2b50  messages', function () {
  var Wii, multiwii, serialport, sandbox, port, wii;
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
    multiwii = proxyquire('../../lib/wii', {
      'serialport': serialport
    });
    Wii = multiwii.Wii;
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
      port.on.withArgs('data').yield(new Buffer([0, 0, 0, 7, 100, 2, 1, 1, 0, 0, 0, 0]));
      expect(listener).calledWith({
        version: 2,
        multitype: 'TRI',
        mspVersion: 1,
        capability: 0
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
        0, 1,       // cycleTime
        1, 1,       // i2cErrorCount
        2, 1,       // sensor
        3, 1, 0, 0  // flags
      ]));
      expect(listener).calledWith({
        cycleTime: 256,
        i2cErrorCount: 257,
        sensor: 258,
        flags: 259
      });
    });
  });

  describe('servo', function () {
    it('parses the message correctly', function () {
      var listener = sinon.spy();
      wii.on('servo', listener);
      port.on.withArgs('data').yield(new Buffer([0, 0, 0, 16, 103,
        0, 1,       // servo[0]
        1, 1,       // servo[1]
        2, 1,       // servo[2]
        3, 1,       // servo[3]
        4, 1,       // servo[4]
        5, 1,       // servo[5]
        6, 1,       // servo[6]
        7, 1        // servo[7]
      ]));
      expect(listener).calledWith([256, 257, 258, 259, 260, 261, 262, 263]);
    });
  });

  describe('motor', function () {
    it('parses the message correctly', function () {
      var listener = sinon.spy();
      wii.on('motor', listener);
      port.on.withArgs('data').yield(new Buffer([0, 0, 0, 16, 104,
        0, 1,       // motor[0]
        1, 1,       // motor[1]
        2, 1,       // motor[2]
        3, 1,       // motor[3]
        4, 1,       // motor[4]
        5, 1,       // motor[5]
        6, 1,       // motor[6]
        7, 1        // motor[7]
      ]));
      expect(listener).calledWith([256, 257, 258, 259, 260, 261, 262, 263]);
    });
  });
  
});