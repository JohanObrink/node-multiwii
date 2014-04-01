/*jshint expr: true*/

var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('MultiWii', function () {
  var Wii, serialport, sandbox, port;
  beforeEach(function () {
    port = {
      on: sinon.stub(),
      removeListener: sinon.stub(),
      write: sinon.stub(),
      close: sinon.spy()
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
    sandbox.stub(process, 'nextTick').yields();
  });
  afterEach(function () {
    sandbox.restore();
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
    it('sets defaults', function () {
      var wii = new Wii();
      expect(wii.options.baudrate).to.equal(115200);
      expect(wii.options.databits).to.equal(8);
      expect(wii.options.stopbits).to.equal(1);
      expect(wii.options.parity).to.equal('none');
      expect(wii.options.parser).to.eql(serialport.parsers.raw);
    });
    it('merges with defaults', function () {
      var wii = new Wii({ parity: 'even', parser: 'herro' });
      expect(wii.options.baudrate).to.equal(115200);
      expect(wii.options.databits).to.equal(8);
      expect(wii.options.stopbits).to.equal(1);
      expect(wii.options.parity).to.equal('even');
      expect(wii.options.parser).to.equal('herro');
    });
  });

  describe('Wii.list', function () {
    it('calls serialport to list available devices', function () {
      var listener = sinon.spy();
      Wii.list(listener);
      expect(serialport.list).calledOnce;
    });
    it('calls callback with error on fail', function () {
      var listener = sinon.spy();
      Wii.list(listener);
      serialport.list.yield('error');
      expect(listener).calledWith('error');
    });
    it('calls callback with list on success', function () {
      var listener = sinon.spy();
      Wii.list(listener);
      serialport.list.yield(null, []);
      expect(listener).calledWith(null, []);
    });
    it('returns a promise if no callback is passed in', function () {
      var promise = Wii.list();
      expect(promise).to.be.an('object');
      expect(promise.then).to.be.a('function');
      expect(promise.catch).to.be.a('function');
      expect(promise.finally).to.be.a('function');
    });
    it('resolves the promise when serialport.list succeeds', function () {
      var success = sinon.spy();
      var fail = sinon.spy();
      Wii.list().then(success).catch(fail);
      serialport.list.yield(null, []);
      expect(success).called;
      expect(success).calledWith([]);
      expect(fail).not.called;
    });
    it('rejects the promise when serialport.list fails', function () {
      var success = sinon.spy();
      var fail = sinon.spy();
      Wii.list().then(success).catch(fail);
      serialport.list.yield('error');
      expect(success).not.called;
      expect(fail).calledWith('error');
    });
  });

  describe('#connect', function () {
    it('uses port from constructor', function () {
      var wii = new Wii({ port: { comName: '/foo/bar' }});
      wii.connect();
      expect(serialport.SerialPort).calledOnce;
      expect(serialport.SerialPort).calledWithNew;
      expect(serialport.SerialPort).calledWith('/foo/bar', {
        baudrate: 115200,
        databits: 8,
        stopbits: 1,
        parity: 'none',
        parser: serialport.parsers.raw
      });
    });
    it('uses port from argument object', function () {
      var wii = new Wii({ port: { comName: '/foo/bar' }});
      wii.connect({ comName: '/herp/derp' });
      expect(serialport.SerialPort).calledOnce;
      expect(serialport.SerialPort).calledWithNew;
      expect(serialport.SerialPort).calledWith('/herp/derp', {
        baudrate: 115200,
        databits: 8,
        stopbits: 1,
        parity: 'none',
        parser: serialport.parsers.raw
      });
    });
    it('uses port from argument string', function () {
      var wii = new Wii({ port: { comName: '/foo/bar' }});
      wii.connect('/herp/derp');
      expect(serialport.SerialPort).calledOnce;
      expect(serialport.SerialPort).calledWithNew;
      expect(serialport.SerialPort).calledWith('/herp/derp', {
        baudrate: 115200,
        databits: 8,
        stopbits: 1,
        parity: 'none',
        parser: serialport.parsers.raw
      });
    });
    it('throws an error if no port is specified', function () {
      var wii = new Wii();
      expect(function () { wii.connect(); }).to.throw(Error, /no port specified/);
    });
    it('uses options from argument', function () {
      var wii = new Wii();
      wii.connect('/herp/derp', { parity: 'even' });
      expect(serialport.SerialPort).calledOnce;
      expect(serialport.SerialPort).calledWithNew;
      expect(serialport.SerialPort).calledWith('/herp/derp', {
        baudrate: 115200,
        databits: 8,
        stopbits: 1,
        parity: 'even',
        parser: serialport.parsers.raw
      });
    });
    it('returns a promise', function () {
      var wii = new Wii();
      var promise = wii.connect('/dev/derp');
      expect(promise).to.be.an('object');
      expect(promise.then).to.be.a('function');
      expect(promise.catch).to.be.a('function');
      expect(promise.finally).to.be.a('function');
    });
    it('adds listeners', function () {
      var wii = new Wii();
      wii.connect('/dev/derp');
      expect(port.on).calledTwice;
      expect(port.on.withArgs('error')).calledOnce;
      expect(port.on.withArgs('open')).calledOnce;
    });
    it('resolves promise on open', function () {
      var success = sinon.spy();
      var fail = sinon.spy();
      var wii = new Wii();
      wii.connect('/dev/derp').then(success).catch(fail);
      port.on.withArgs('open').yield();
      expect(success).calledOnce;
      expect(success).calledWith(wii);
      expect(fail).not.called;
    });
    it('clears and removes connect failed listener', function () {
      var success = sinon.spy();
      var fail = sinon.spy();
      var wii = new Wii();
      wii.connect('/dev/derp').then(success).catch(fail);
      var _onError = wii._onError;
      port.on.withArgs('error').yield('bork');
      expect(port.removeListener).calledWith('error', _onError);
      expect(wii._onError).to.not.exist;
    });
    it('rejects promise on error', function () {
      var success = sinon.spy();
      var fail = sinon.spy();
      var wii = new Wii();
      wii.connect('/dev/derp').then(success).catch(fail);
      port.on.withArgs('error').yield('bork');
      expect(success).not.called;
      expect(fail).calledOnce;
      expect(fail).calledWith('bork');
    });

    describe('#onOpen', function () {
      var wii, _onConnect;

      beforeEach(function () {
        wii = new Wii();
        wii.connect('/dev/derp');
        _onConnect = wii._onConnect;
        port.on.withArgs('open').yield();
      });

      it('sets connected property to true', function () {
        expect(wii.connected).to.be.true;
      });

      it('adds listener for data', function () {
        expect(port.on.withArgs('data')).calledOnce;
      });

      it('clears and removes connect listener', function () {
        expect(port.removeListener).calledWith('open', _onConnect);
        expect(wii._onConnect).to.not.exist;
      });

      describe('#onError', function () {
        it('emits error', function () {
          var listener = sinon.spy();
          wii.on('error', listener);
          var err = new Error();
          port.on.withArgs('error').yield(err);
          expect(listener).calledOnce;
        });
      });

      describe('\u26a1 disconnect', function () {
        var listener;

        beforeEach(function () {
          listener = sinon.spy();
          wii.on('disconnect', listener);
          port.on.withArgs('error').yield({ errno: -1, code: 'UNKNOWN' });
        });

        it('emits disconnect', function () {
          expect(listener).calledOnce;
        });
        it('sets connected to false', function () {
          expect(wii.connected).to.be.false;
        });
        it('clears listeners', function () {
          expect(port.removeListener).calledWith('error', wii.onError);
          expect(port.removeListener).calledWith('data', wii.onData);
        });
      });

      describe('\u26a1 data', function () {
        var listener;

        beforeEach(function () {
          listener = sinon.spy();
          wii.on('data', listener);
        });

        it('emits raw data', function () {
          var buffer = new Buffer([0xff, 0xfe]);
          port.on.withArgs('data').yield(buffer);
          expect(listener).calledOnce;
          expect(listener).calledWith(buffer);
        });
      });
    
      describe('#send', function () {
        it('sends out messages correctly', function () {
          wii.send(105);
          var expected = Array.prototype.slice.call(new Buffer([0x24, 0x4D, 0x3C, 0, 105, 105, 0]));
          var sent = Array.prototype.slice.call(port.write.getCall(0).args[0]);

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
});