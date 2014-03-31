'use strict';

var merge = require('./merge'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter,
  serialport = require('serialport'),
  SerialPort = serialport.SerialPort,
  Q = require('q');

function Wii(options) {
  if(!options) {
    options = {};
  } else if('string' === typeof options) {
    options = { port: options };
  }
  this.options = merge(options, Wii.defaults);

  this.onData = this.onData.bind(this);
  this.onError = this.onError.bind(this);

  this.messages = {};
  this.readMessages = {};
  require('./messages').register(this);
}

util.inherits(Wii, EventEmitter);

Wii.prototype.connect = function(port, options) {
  if('string' === typeof port) {
    port = { comName: port };
  } else {
    port = port || this.options.port;
  }

  if(!port) {
    throw new Error('no port specified');
  }

  options = options || {};
  options.port = undefined;
  
  var deferred = Q.defer();

  this.port = new SerialPort(port.comName, merge(options, this.options));

  this._onConnect = function () {
    this.port.removeListener('open', this._onConnect);
    delete this._onConnect;
    this.onOpen();
    deferred.resolve(this);
  }.bind(this);

  this._onError = function (err) {
    this.port.removeListener('error', this._onError);
    delete this._onError;
    deferred.reject(err);
  }.bind(this);

  this.port.on('error', this._onError);
  this.port.on('open', this._onConnect);

  return deferred.promise;
};

Wii.prototype.onOpen = function () {
  this.connected = true;
  this.port.on('error', this.onError);
  this.port.on('data', this.onData);
};

Wii.prototype.onError = function (err) {
  if(err.errno === -1 && err.code === 'UNKNOWN') {
    this.disconnect();
  } else {
    this.emit('error', err);
  }
};

Wii.prototype.disconnect = function () {
  this.connected = false;
  this.emit('disconnect');
  this.port.removeListener('error', this.onError);
  this.port.removeListener('data', this.onData);
  this.port.close();
};

Wii.prototype.onData = function (buffer) {
  this.emit('data', buffer);

  var len = buffer[3];
  var type = buffer[4];
  var data = buffer.slice(5, 5+len);
  var message = this.messages[type];
  if(message) {
    this.emit(message.name, message.parse(data));
  }
};

Wii.prototype.addOutMessage = function(id, name, parseFunction) {
  this.messages[id] = { name: name, parse: parseFunction };
  this.readMessages[name] = id;
};

Wii.prototype.read = function(messageName) {
  return this.send(this.readMessages[messageName]);
};

Wii.prototype.send = function(messageId, data) {
  var msg = Wii.sendHeader.slice();     // header
  msg.push(data ? data.length +6 : 0);  // length
  msg.push(messageId);
  if(data) {
    msg = msg.concat(data);
  }
  msg.push(this.calculateChecksum(msg));
  msg.push(0);
  this.port.write(new Buffer(msg));
};

Wii.prototype.dispose = function() {
  this.disconnect();
  this.removeAllListeners();
};

Wii.prototype.calculateChecksum = function(message) {
  return message.slice(3).reduce(function(tot, cur) { return tot ^ cur; }, 0);
};

Wii.list = function (callback) {
  var deferred = Q.defer();
  serialport.list(function (err, ports) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(ports);
    }
  });
  if('function' === typeof callback) {
    deferred.promise.nodeify(callback);
  } else {
    return deferred.promise;
  }
};

Wii.defaults = {
  baudrate: 115200,
  databits: 8,
  stopbits: 1,
  parity: 'none',
  parser: serialport.parsers.raw
};

Wii.sendHeader = [0x24, 0x4D, 0x3C];

module.exports = Wii;