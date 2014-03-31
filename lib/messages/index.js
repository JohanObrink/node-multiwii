
var fs = require('fs'),
  path = require('path');

exports.register = function (wii) {
  fs.readdirSync(__dirname + '/out')
    .map(function (file) {
      return path.basename(file, '.js');
    })
    .forEach(function (file) {
      var message = require('./out/' + file);
      wii.addOutMessage(message.messageId, file, message.parse);
    });
};