var Wii = require('../../').Wii,
  chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('MultiWii', function () {
  var wii, log;
  before(function (done) {
    wii = new Wii();

    wii.on('data', function (data) {
      //console.log(data);
    });
    log = sinon.spy(); //console.log.bind(log);

    Wii.list().then(function (ports) {
      var devices = ports.filter(function (port) {
        return port.productId === '0x8036';
      });
      if(!devices.length) {
        done('No device found');
      } else {
        wii.connect(devices[0]).then(function () {
          done();
        }).catch(done);
      }
    });
  });

  after(function () {
    wii.dispose();
  });

  describe('read rc', function () {
    it('can read rc values', function (done) {
      wii.once('rc', function (data) {
        log(data);
        expect(data).to.have.keys(['roll', 'pitch', 'yaw', 'throttle', 'aux1', 'aux2', 'aux3', 'aux4']);
        done();
      });
      wii.read('rc');
    });
  });

  describe('read status', function () {
    it('can read status values', function (done) {
      wii.once('status', function (data) {
        log(data);
        expect(data).to.have.keys(['cycleTime', 'i2cErrorCount', 'accBaro', 'dafuq']);
        done();
      });
      wii.read('status');
    });
  });

  describe('read ident', function () {
    it('can read ident values', function (done) {
      wii.once('ident', function (data) {
        log(data);
        expect(data).to.have.keys(['version', 'multitype', 'subversion']);
        done();
      });
      wii.read('ident');
    });
  });

  describe('setRawRc', function () {
    it('can set rc values', function (done) {
      var roll = 1200,
        pitch = 1600,
        yaw = 700,
        throttle = 1100,
        aux1 = 1000,
        aux2 = 2000,
        aux3 = 1500,
        aux4 = 1350;

      wii.once('rc', function (data) {
        log(data);
        expect(data).to.eql({
          roll: roll,
          pitch: pitch,
          yaw: yaw,
          throttle: throttle,
          aux1: aux1,
          aux2: aux2,
          aux3: aux3,
          aux4: aux4
        });
        done();
      });

      wii
        .setRawRc(roll, pitch, yaw, throttle, aux1, aux2, aux3, aux4)
        .then(function () {  wii.read('rc'); })
        .catch(done);
    });
  });
});