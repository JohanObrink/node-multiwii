
exports.messageId = 107;

exports.parse = function (data) {
  return {
    distanceToHome: data.readUInt16LE(0),
    directionToHome: data.readUInt16LE(2),
    update: data.readUInt8(4)
  };
};