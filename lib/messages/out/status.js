
exports.messageId = 101;

exports.parse = function(data) {
  return {
    cycleTime: data.readInt16LE(0),
    i2cErrorCount: data.readInt16LE(2),
    sensor: data.readInt16LE(4),
    flags: data.readInt32LE(6)
  };
};