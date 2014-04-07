
exports.messageId = 101;

exports.parse = function(data) {
  return {
    cycleTime: data.readUInt16LE(0),
    i2cErrorCount: data.readUInt16LE(2),
    sensor: data.readUInt16LE(4),
    flags: data.readUInt32LE(6)
  };
};