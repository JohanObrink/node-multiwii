'use strict'
/*jshint expr: true*/

const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const proxyquire = require('proxyquire')

chai.use(require('sinon-chai'))

describe('\u2b50  MultiWii', () => {
  let multiwii, Wii, serialport, sandbox, port
  beforeEach(() => {
    port = {
      on: sinon.stub(),
      once: sinon.stub(),
      removeListener: sinon.stub(),
      removeAllListeners: sinon.stub(),
      write: sinon.stub(),
      close: sinon.spy()
    }
    port.on.returns(port)
    port.once.returns(port)
    port.removeListener.returns(port)
    port.removeAllListeners.returns(port)

    serialport = {
      list: sinon.stub(),
      parsers: {
        raw: {}
      },
      SerialPort: sinon.stub().returns(port)
    }
    multiwii = proxyquire(process.cwd() + '/lib/wii', {
      'serialport': serialport
    })
    Wii = multiwii.Wii
  })

  it('returns a reference to Wii', () => {
    expect(Wii).to.be.a('function');
    expect(new Wii()).to.instanceof(Wii);
  });

  describe('constructor', () => {
    it('sets option values from arg obj', () => {
      let wii = new Wii({port: '/dev/device'})
      expect(wii.options.port).to.equal('/dev/device')
    })
    it('sets option port from arg string', () => {
      let wii = new Wii('/dev/device')
      expect(wii.options.port).to.equal('/dev/device')
    })
    it('sets defaults', () => {
      let wii = new Wii()
      expect(wii.options.baudrate).to.equal(115200)
      expect(wii.options.databits).to.equal(8)
      expect(wii.options.stopbits).to.equal(1)
      expect(wii.options.parity).to.equal('none')
      expect(wii.options.parser).to.eql(serialport.parsers.raw)
    })
    it('merges with defaults', () => {
      let wii = new Wii({ parity: 'even', parser: 'herro' })
      expect(wii.options.baudrate).to.equal(115200)
      expect(wii.options.databits).to.equal(8)
      expect(wii.options.stopbits).to.equal(1)
      expect(wii.options.parity).to.equal('even')
      expect(wii.options.parser).to.equal('herro')
    })
  })

  describe('list', () => {
    it('resolves the promise when serialport.list succeeds', () => {
      serialport.list.yields(null, [])

      return multiwii.list()
        .then(result => {
          expect(result).to.eql([])
        })
    })
    it('rejects the promise when serialport.list fails', () => {
      serialport.list.yields('error');

      return multiwii.list()
        .then(result => Promise.reject(result))
        .catch(error => {
          expect(error).to.equal('error')
        })
    })
  })

  describe('#connect', () => {
    it('uses port from constructor', () => {
      let wii = new Wii({port: {comName: '/foo/bar'}})

      wii.connect()

      expect(serialport.SerialPort)
        .calledOnce
        .calledWithNew
        .calledWith('/foo/bar', {
          baudrate: 115200,
          databits: 8,
          stopbits: 1,
          parity: 'none',
          parser: serialport.parsers.raw
        })
    })
    it('uses port from argument object', () => {
      let wii = new Wii({port: {comName: '/foo/bar'}})

      wii.connect({comName: '/herp/derp'})

      expect(serialport.SerialPort)
        .calledOnce
        .calledWithNew
        .calledWith('/herp/derp', {
          baudrate: 115200,
          databits: 8,
          stopbits: 1,
          parity: 'none',
          parser: serialport.parsers.raw
        })
    })
    it('uses port from argument string', () => {
      let wii = new Wii({port: {comName: '/foo/bar'}})

      wii.connect('/herp/derp')

      expect(serialport.SerialPort)
        .calledOnce
        .calledWithNew
        .calledWith('/herp/derp', {
          baudrate: 115200,
          databits: 8,
          stopbits: 1,
          parity: 'none',
          parser: serialport.parsers.raw
        })
    })
    it('throws an error if no port is specified', () => {
      let wii = new Wii()

      return wii.connect()
        .then(r => Promise.reject(r))
        .catch(err => {
          expect(err.toString()).to.equal('Error: no port specified')
        })
    })
    it('uses options from argument', () => {
      let wii = new Wii()

      wii.connect('/herp/derp', {parity: 'even'})

      expect(serialport.SerialPort)
        .calledOnce
        .calledWithNew
        .calledWith('/herp/derp', {
          baudrate: 115200,
          databits: 8,
          stopbits: 1,
          parity: 'even',
          parser: serialport.parsers.raw
        })
    })
    it('adds listeners', () => {
      let wii = new Wii()

      wii.connect('/dev/derp')

      expect(port.once)
        .calledTwice
        .calledWith('open')
        .calledWith('error')
    })
    it('resolves port on open', () => {
      let wii = new Wii()

      let connect = wii.connect('/dev/derp')
        .then(p => {
          expect(p).to.eql(port)
        })
      port.once.withArgs('open').yield(port)
      return connect
    })
    it('clears and removes connect failed on success', () => {
      let wii = new Wii()

      let connect = wii.connect('/dev/derp')
        .then(() => {
          expect(port.removeListener).calledWith('error')
        })
      port.once.withArgs('open').yield()

      return connect
    });
    it('rejects promise on error', () => {
      let wii = new Wii()

      let connect = wii.connect('/dev/derp')
        .then(res => Promise.reject(res))
        .catch(err => {
          expect(err).to.equal('bork')
        })
      port.once.withArgs('error').yield('bork')

      return connect
    });
    describe('#onOpen', () => {
      let wii
      beforeEach(() => {
        wii = new Wii()
        let connect = wii.connect('/dev/derp')
        port.once.withArgs('open').yield()
        return connect
      })
      it('sets connected property to true', () => {
        expect(wii.connected).to.be.true
      })
      it('adds listeners', () => {
        expect(port.on)
          .calledTwice
          .calledWith('data')
          .calledWith('error')
      })
      describe('#onError', () => {
        it('emits error', () => {
          let listener = sinon.spy()
          wii.on('error', listener)

          var err = new Error()
          port.on.withArgs('error').yield(err)

          expect(listener).calledOnce
        })
      })
      describe('\u26a1 disconnect', () => {
        let listener
        beforeEach(() => {
          listener = sinon.spy()
          wii.on('disconnect', listener)
          port.on.withArgs('error').yield({ errno: -1, code: 'UNKNOWN' })
        })
        it('emits disconnect', () => {
          expect(listener).calledOnce
        })
        it('sets connected to false', () => {
          expect(wii.connected).to.be.false
        })
        it('clears listeners', () => {
          expect(port.removeAllListeners).calledOnce
        })
      })
      describe('\u26a1 data', () => {
        var listener;

        beforeEach(() => {
          listener = sinon.spy();
          wii.on('data', listener);
        });

        it('emits raw data', () => {
          var buffer = new Buffer([0xff, 0xfe]);
          port.on.withArgs('data').yield(buffer);
          expect(listener).calledOnce;
          expect(listener).calledWith(buffer);
        });
      });

      describe('#send', () => {
        it('sends out messages correctly', () => {
          wii.send(105);
          var expected = Array.prototype.slice.call(new Buffer([0x24, 0x4D, 0x3C, 0, 105, 105, 0]));
          var sent = Array.prototype.slice.call(port.write.getCall(0).args[0]);

          expect(sent).to.eql(expected);
        });
      });

      describe('#calculateChecksum', () => {
        it('can calculate the checksum', () => {
          var buffer = new Buffer(40);
          var data = new Buffer([0x24, 0x4d, 0x3e, 0x0a, 0x65, 0x28, 0x0b, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x00, 0x00]);
          data.copy(buffer, 0);
          var checksum = wii.calculateChecksum(buffer);
          expect(checksum).to.equal(0x6d);
        });
        it('can calculate another checksum', () => {
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
