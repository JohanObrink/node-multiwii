
exports.messageId = 106;

exports.parse = function (data) {
  return {
    fix: data.readInt8(0),
    numSat: data.readInt8(1),
    lat: data.readInt32LE(2),
    lon: data.readInt32LE(6),
    altitude: data.readInt16LE(10),
    speed: data.readInt16LE(12)
  };
};