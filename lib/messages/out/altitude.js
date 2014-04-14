
exports.messageId = 109;

exports.parse = function (data) {
  return {
    estimatedAltitude: data.readUInt32LE(0)
  };
};