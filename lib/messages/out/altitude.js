
exports.messageId = 109;

exports.parse = function (data) {
  return {
    estimatedAltitude: data.readInt32LE(0)
  };
};