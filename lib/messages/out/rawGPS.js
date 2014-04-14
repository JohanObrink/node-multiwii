
exports.messageId = 106;

exports.parse = function (data) {
  return {
    fix: data.readUInt8(0),
    numSat: data.readUInt8(1),
    lat: data.readUInt32LE(2),
    lon: data.readUInt32LE(6),
    altitude: data.readUInt16LE(10),
    speed: data.readUInt16LE(12)
  };
};