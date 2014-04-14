
exports.messageId = 112;

exports.parse = function (data) {
  return {
    p8: data.readUInt8(0),
    i8: data.readUInt8(1),
    d8: data.readUInt8(2)
  };
};