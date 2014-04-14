
exports.messageId = 107;

exports.parse = function (data) {
  return {
    distanceToHome: data.readInt16LE(0),
    directionToHome: data.readInt16LE(2),
    update: data.readInt8(4)
  };
};