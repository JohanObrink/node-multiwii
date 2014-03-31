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
    this.port.off('open', this._onConnect);
    delete this._onConnect;
    this.onOpen();
    deferred.resolve(this);
  }.bind(this);

  this._onError = function (err) {
    this.port.off('error', this._onError);
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
    this.onDisconnect();
  } else {
    this.emit('error', err);
  }
};

Wii.prototype.onDisconnect = function () {
  this.connected = false;
  this.emit('disconnect');
  this.port.off('error', this.onError);
  this.port.off('data', this.onData);
};

Wii.prototype.onData = function (buffer) {
  this.emit('data', buffer);
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

module.exports = Wii;