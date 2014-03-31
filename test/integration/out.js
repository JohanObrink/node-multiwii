var Wii = require('../../').Wii,
  chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('MultiWii', function () {
  var wii;
  before(function (done) {
    wii = new Wii();

    wii.on('data', function (data) {
      //console.log(data);
    });

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
      wii.on('rc', function (data) {
        console.log(data);
        expect(data).to.have.keys(['roll', 'pitch', 'yaw', 'throttle', 'aux1', 'aux2', 'aux3', 'aux4']);
        done();
      });
      wii.read('rc');
    });
  });

  describe('read status', function () {
    it('can read status values', function (done) {
      wii.on('status', function (data) {
        console.log(data);
        expect(data).to.have.keys(['cycleTime', 'i2cErrorCount', 'accBaro', 'dafuq']);
        done();
      });
      wii.read('status');
    });
  });

  describe('read ident', function () {
    it('can read ident values', function (done) {
      wii.on('ident', function (data) {
        console.log(data);
        expect(data).to.have.keys(['version', 'multitype', 'subversion']);
        done();
      });
      wii.read('ident');
    });
  });
});