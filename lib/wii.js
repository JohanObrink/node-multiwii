'use strict';

var merge = require('./merge'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter,
  serialport = require('serialport'),
  SerialPort = serialport.SerialPort,
  Q = require('q');


// var list = function (callback) {
//   var deferred = Q.defer();
//   serialport.list(function (err, ports) {
//     if(err) {
//       deferred.reject(err);
//     } else {
//       deferred.resolve(ports);
//     }
//   });
//   if('function' === typeof callback) {
//     deferred.promise.nodeify(callback);
//   } else {
//     return deferred.promise;
//   }
// };

// var defaults = {
//   baudrate: 115200,
//   databits: 8,
//   stopbits: 1,
//   parity: 'none',
//   parser: serialport.parsers.raw
// };

var sendHeader = [0x24, 0x4D, 0x3C];

function Wii(connection, options) {
  if (!connection) {
    throw new Error("Connection must be provided that implements a stream interface");
  }
  this.options = options || {};
  this.socket = connection;

  this.messages = {};
  this.readMessages = {};

  require('./messages').register(this);

  this.connected = true;
  this.socket.on('error', this.onError);
  this.socket.on('data', this.onData);
});

util.inherits(Wii, EventEmitter);

Wii.prototype.onData = function (buffer) {
  this.emit('data', buffer);
  var len = buffer[3];
  var type = buffer[4];
  var data = buffer.slice(5, 5+len);
  var message = this.messages[type];
  if(message && 'function' === typeof message.parse) {
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
  new Buffer(sendHeader).copy(msg, 0);            // header
  msg.writeUInt8(len, 3);                             // length
  msg.writeUInt8(msgId, 4);                           // message id
  if(data) {
    data.copy(msg, 5);                                // data
  }
  msg.writeUInt8(this.calculateChecksum(msg), 5 + len);  // checksum
  msg.writeUInt8(0, 6 + len);                         // derp data to force wii to comply
  this.socket.write(msg, function (err, result) {
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
    this.socket.removeListener('error', this.onError);
    this.socket.removeListener('data', this.onData);
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

module.exports = Wii