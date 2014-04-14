
exports.messageId = 112;

exports.parse = function (data) {
  return {
    p8: data.readInt8(0),
    i8: data.readInt8(1),
    d8: data.readInt8(2)
  };
};