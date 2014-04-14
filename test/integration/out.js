var multiwii = require('../../'),
  Wii = multiwii.Wii,
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
    log = function () {
      console.log.apply(console, Array.prototype.slice.call(arguments));
    };

    multiwii.list().then(function (ports) {
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

  describe('read values', function () {
    it('can read rc values', function (done) {
      wii.once('rc', function (data) {
        log(data);
        expect(data).to.have.keys(['roll', 'pitch', 'yaw', 'throttle', 'aux1', 'aux2', 'aux3', 'aux4']);
        done();
      });
      wii.read('rc');
    });

    it('can read status values', function (done) {
      wii.once('status', function (data) {
        log(data);
        expect(data).to.have.keys(['cycleTime', 'i2cErrorCount', 'sensor', 'flags']);
        done();
      });
      wii.read('status');
    });

    it('can read ident values', function (done) {
      wii.once('ident', function (data) {
        log(data);
        expect(data).to.have.keys(['version', 'multitype', 'mspVersion', 'capability']);
        done();
      });
      wii.read('ident');
    });

    it('can read servo values', function (done) {
      wii.once('servo', function (data) {
        log(data);
        expect(data).to.be.instanceof(Array).with.length(8);
        done();
      });
      wii.read('servo');
    });

    it('can read motor values', function (done) {
      wii.once('motor', function (data) {
        log(data);
        expect(data).to.be.instanceof(Array).with.length(8);
        done();
      });
      wii.read('motor');
    });

    it('can read altitude values', function (done) {
      wii.once('altitude', function (data) {
        log(data);
        expect(data).to.have.keys(['estimatedAltitude']);
        done();
      });
      wii.read('altitude');
    });

    it.only('can read attitude values', function (done) {
      wii.once('attitude', function (data) {
        log(data);
        expect(data).to.have.keys(['angles', 'heading', 'headFreeModeHold']);
        done();
      });
      wii.read('attitude');
    });

    it('can read bat values', function (done) {
      wii.once('bat', function (data) {
        log(data);
        expect(data).to.have.keys(['vbat', 'intPowerMeterSum']);
        done();
      });
      wii.read('bat');
    });

    xit('can read box values', function (done) {
      wii.once('box', function (data) {
        log(data);
        expect(data).to.have.keys(['ACC', 'BARO', 'MAG', 'CAMSTAB', 'CAMTRIG', 'ARM', 'GPS HOME', 'GPS HOLD', 'PASSTHRU', 'HEADFREE', 'BEEPER', 'LEDMAX', 'LLIGHTS', 'HEADADJ']);
        done();
      });
      wii.read('box');
    });

    xit('can read compGPS values', function (done) {
      wii.once('compGPS', function (data) {
        log(data);
        expect(data).to.have.keys(['distanceToHome', 'directionToHome', 'update']);
        done();
      });
      wii.read('compGPS');
    });

    xit('can read misc values', function (done) {
      wii.once('misc', function (data) {
        log(data);
        expect(data).to.have.keys(['powerTrigger']);
        done();
      });
      wii.read('misc');
    });

    xit('can read motorPins', function (done) {
      wii.once('motorPins', function (data) {
        log(data);
        expect(data).to.be.instanceof(Array).with.length(8);
        done();
      });
      wii.read('motorPins');
    });

    xit('can read pid values', function (done) {
      wii.once('pid', function (data) {
        log(data);
        expect(data).to.have.keys(['p8', 'i8', 'd8']);
        done();
      });
      wii.read('pid');
    });

    xit('can read rawGPS values', function (done) {
      wii.once('rawGPS', function (data) {
        log(data);
        expect(data).to.have.keys(['fix', 'numSat', 'lat', 'lon', 'altitude', 'speed']);
        done();
      });
      wii.read('rawGPS');
    });

    xit('can read rawImu values', function (done) {
      wii.once('rawImu', function (data) {
        log(data);
        expect(data).to.have.keys(['accSmooth', 'gyroData', 'magADC']);
        done();
      });
      wii.read('rawImu');
    });

    xit('can read rcTuning values', function (done) {
      wii.once('rcTuning', function (data) {
        log(data);
        expect(data).to.have.keys(['rcRate', 'rcExpo', 'rollPitchRate', 'yawRate', 'dynThrPID', 'thrMid', 'thrExpo']);
        done();
      });
      wii.read('rcTuning');
    });
  });

  describe('setRawRc', function () {
    it('can set rc values', function (done) {
      var roll = 1300,
        pitch = 1100,
        yaw = 900,
        throttle = 1200,
        aux1 = 1100,
        aux2 = 1300,
        aux3 = 1700,
        aux4 = 1650;

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