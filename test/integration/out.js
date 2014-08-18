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

    log = function () {
      //console.log.apply(console, Array.prototype.slice.call(arguments));
    };

    wii.on('data', function (data) {
      log(data);
    });

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

    it('can read attitude values', function (done) {
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

    it('can read misc values', function (done) {
      wii.once('misc', function (data) {
        log(data);
        expect(data).to.have.keys(['powerTrigger']);
        done();
      });
      wii.read('misc');
    });

    it('can read motorPins', function (done) {
      wii.once('motorPins', function (data) {
        log(data);
        expect(data).to.be.instanceof(Array).with.length(8);
        done();
      });
      wii.read('motorPins');
    });

    it('can read pid values', function (done) {
      wii.once('pid', function (data) {
        log(data);

        expect(data).to.have.keys([
          'roll',
          'pitch',
          'yaw',
          'alt',
          'pos',
          'posr',
          'navr',
          'level',
          'mag'
        ]);

        expect(data.roll).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 40, i: 30, d: 23 });

        expect(data.pitch).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 40, i: 30, d: 23 });

        expect(data.yaw).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 85, i: 45, d: 0 });

        expect(data.alt).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 16, i: 15, d: 7 });

        expect(data.pos).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 11, i: 0, d: 0 });

        expect(data.posr).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 20, i: 8, d: 45 });

        expect(data.navr).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 14, i: 20, d: 80 });

        expect(data.level).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 70, i: 10, d: 100 });

        expect(data.mag).to
          .have.keys(['p', 'i', 'd'])
          .and.eql({ p: 40, i: 11, d: 0 });

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

    it('can read rawImu values', function (done) {
      wii.once('rawImu', function (data) {
        log(data);
        expect(data).to.have.keys(['accSmooth', 'gyroData', 'magADC']);
        done();
      });
      wii.read('rawImu');
    });

    it('can read rcTuning values', function (done) {
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

    it('can set acc calibration', function (done) {
      this.timeout(2600);

      var roll = 1300,
        pitch = 1100,
        yaw = 900,
        throttle = 1200,
        aux1 = 1100,
        aux2 = 1300,
        aux3 = 1700,
        aux4 = 1650;

      wii.once('rawImu', function (data) {
        log(data);
        done();
      });

      wii
        .setAccCalibration()
        .then(function () {
          setTimeout(function () {
            wii.read('rawImu');
          }, 2500);
        })
        .catch(done);
    });

    it('can set pids', function (done) {
      var defaultValues = {
        roll: { p: 40, i: 30, d: 23 },
        pitch: { p: 40, i: 30, d: 23 },
        yaw: { p: 85, i: 45, d: 0 },
        alt: { p: 16, i: 15, d: 7 },
        pos: { p: 11, i: 0, d: 0 },
        posr: { p: 20, i: 8, d: 45 },
        navr: { p: 14, i: 20, d: 80 },
        level: { p: 70, i: 10, d: 100 },
        mag: { p: 40, i: 11, d: 0 }
      };
      var testValues = {
        roll: { p: 30, i: 36, d: 25 },
        pitch: { p: 50, i: 28, d: 24 },
        yaw: { p: 70, i: 41, d: 3 },
        alt: { p: 12, i: 17, d: 9 },
        pos: { p: 18, i: 2, d: 1 },
        posr: { p: 23, i: 9, d: 47 },
        navr: { p: 16, i: 22, d: 82 },
        level: { p: 68, i: 12, d: 95 },
        mag: { p: 45, i: 13, d: 6 }
      };

      wii.once('pid', function (data) {
        log(data);
        expect(data).to.eql(testValues);

        // reset
        wii.setPid(
          defaultValues.roll,
          defaultValues.pitch,
          defaultValues.yaw,
          defaultValues.alt,
          defaultValues.pos,
          defaultValues.posr,
          defaultValues.navr,
          defaultValues.level,
          defaultValues.mag
        );

        done();
      });

      wii.setPid(
        testValues.roll,
        testValues.pitch,
        testValues.yaw,
        testValues.alt,
        testValues.pos,
        testValues.posr,
        testValues.navr,
        testValues.level,
        testValues.mag
      ).then(function () { wii.read('pid'); }).catch(done);
    });
  });
});