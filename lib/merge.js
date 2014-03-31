'use strict';

function merge(ext, orig) {
  var clone = JSON.parse(JSON.stringify(ext));
  return Object.keys(ext).reduce(function (result, key) {
    if('undefined' === typeof clone[key]) {
      delete result[key];
    } else {
      result[key] = clone[key];
    }
    return result;
  }, JSON.parse(JSON.stringify(orig)));
}

module.exports = merge;