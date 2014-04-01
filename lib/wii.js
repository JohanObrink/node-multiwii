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

Wii.prototype.addInMessage = function(name, parseFunction) {
  this[name] = function () {
    return this.send(parseFunction.apply(this, Array.prototype.slice.call(arguments)));
  }.bind(this);
};

Wii.prototype.read = function(messageName) {
  return this.send(this.readMessages[messageName]);
};

Wii.prototype.send = function(message) {
  var size, len, msgId, data;

  var deferred = Q.defer();

  if('number' === typeof message) {
    msgId = message;
    len = 0;
    size = 7;
  } else if('object' === typeof message) {
    msgId = message.id;
    data = message.data;
    len = data.length;
    size = 7 + data.length;
  }
  var msg = new Buffer(size);
  new Buffer(Wii.sendHeader).copy(msg, 0);            // header
  msg.writeUInt8(len, 3);                             // length
  msg.writeUInt8(msgId, 4);                           // message id
  if(data) {
    data.copy(msg, 5);                                // data
  }
  msg.writeUInt8(this.calculateChecksum(msg), 5 + len);  // checksum
  msg.writeUInt8(0, 6 + len);                         // derp data to force wii to comply
  this.port.write(msg, function (err, result) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
};

Wii.prototype.disconnect = function () {
  if(this.connected) {
    this.connected = false;
    this.emit('disconnect');
    this.port.removeListener('error', this.onError);
    this.port.removeListener('data', this.onData);
    this.port.close();
  }
};

Wii.prototype.dispose = function() {
  this.disconnect();
  this.removeAllListeners();
};

Wii.prototype.calculateChecksum = function(buffer) {
  var data = Array.prototype.slice.call(buffer, 3);
  if(data[0] === 0) {
    // out message
    return data[1];
  } else {
    // in message
    return data
      .slice(0, data[0])
      .reduce(function(tot, cur) { return tot ^ cur; }, 0);
  }
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