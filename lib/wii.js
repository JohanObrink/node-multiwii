'use strict';

const merge = require('./merge')
const util = require('util')
const EventEmitter = require('events').EventEmitter
const serialport = require('serialport')
const SerialPort = serialport.SerialPort
const messages = require('./messages')

const defaults = {
  baudrate: 115200,
  databits: 8,
  stopbits: 1,
  parity: 'none',
  parser: serialport.parsers.raw
}
const sendHeader = [0x24, 0x4D, 0x3C]

function list(callback) {
  return new Promise((resolve, reject) => {
    serialport.list(function (err, ports) {
      if(err) {
        reject(err)
      } else {
        resolve(ports)
      }
    })
  })
}

class Wii extends EventEmitter {
  constructor(options) {
    super()

    options = ('string' === typeof options) ? {port: options} : (options || {})
    this.options = merge(options, defaults)

    this.messages = {}
    this.readMessages = {}

    messages.register(this)
  }
  connect(port, options) {
    return new Promise((resolve, reject) => {
      port = ('string' === typeof port) ? {comName: port} : port || this.options.port

      if(!port) {
        return reject(new Error('no port specified'))
      }

      options = options || {}
      options.port = undefined

      let onConnectionError = err => reject(err)
      this.port = new SerialPort(port.comName, merge(options, this.options))
        .once('open', () => {
          this.port.removeListener('error', onConnectionError)
          this.onOpen()
          resolve(this.port)
        })
        .once('error', onConnectionError)
    })
  }
  onOpen() {
    this.connected = true
    this.port
      .on('error', err => this.onError(err))
      .on('data', data => this.onData(data))
  }
  onError(err) {
    if(err.errno === -1 && err.code === 'UNKNOWN') {
      this.disconnect()
    } else {
      this.emit('error', err)
    }
  }
  onData(buffer) {
    this.emit('data', buffer)

    let len = buffer[3]
    let type = buffer[4]
    let data = buffer.slice(5, 5+len)
    let message = this.messages[type]
    if(message && 'function' === typeof message.parse) {
      this.emit(message.name, message.parse(data))
    }
  }
  addOutMessage(id, name, parseFunction) {
    this.messages[id] = { name: name, parse: parseFunction }
    this.readMessages[name] = id
  }
  addInMessage(name, parseFunction) {
    this[name] = () => this
      .send(parseFunction.apply(this, Array.from(arguments)))
  }
  read(messageName) {
    return this.send(this.readMessages[messageName])
  }
  send(message) {
    let size, len, msgId, data

    if('number' === typeof message) {
      msgId = message
      len = 0
      size = 7
    } else if('object' === typeof message) {
      msgId = message.id
      data = message.data
      len = data.length
      size = 7 + data.length
    }
    let msg = new Buffer(size)
    new Buffer(sendHeader).copy(msg, 0)                   // header
    msg.writeUInt8(len, 3)                                // length
    msg.writeUInt8(msgId, 4)                              // message id
    if(data) { data.copy(msg, 5) }                        // data
    msg.writeUInt8(this.calculateChecksum(msg), 5 + len)  // checksum
    msg.writeUInt8(0, 6 + len)                            // derp data to force wii to comply
    return new Promise((resolve, reject) => {
      this.port.write(msg, (err, result) => {
        if(err) { reject(err) }
        else { resolve() }
      })
    })
  }
  disconnect() {
    if(!this.connected) { return }
    this.connected = false
    this.port.removeAllListeners()
    this.port.close()
    this.emit('disconnect')
  }
  dispose() {
    this.disconnect()
    this.removeAllListeners()
  }
  calculateChecksum(buffer) {
    let data = Array.prototype.slice.call(buffer, 3)
    if(data[0] === 0) {
      // out message
      return data[1]
    } else {
      // in message
      return data
        .slice(0, data[0])
        .reduce(function(tot, cur) { return tot ^ cur }, 0)
    }
  }
}

module.exports = {
  Wii,
  list,
  defaults
};
