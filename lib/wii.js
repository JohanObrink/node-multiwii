'use strict';

var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  serialport = require('serialport');

function Wii(options) {
  if(!options) {
    options = {};
  }
  this.options = ('string' === typeof options) ? { port: options } : options;
}

util.inherits(Wii, EventEmitter);

Wii.prototype.connect = function() {
  
};

Wii.list = function (callback) {
  serialport.list(callback);
};

Wii.defaults = {

};

module.exports = Wii;