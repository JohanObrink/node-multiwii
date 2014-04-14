
exports.messageId = 115;

exports.parse = function (data) {
  return new Array(8).map(function (val, ix) {
    return data.readUInt8(ix);
  });
};