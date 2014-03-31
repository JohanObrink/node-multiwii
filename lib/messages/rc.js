
exports.messageId = 105;

exports.parse = function(data) {
  var arr = 0;
  return {
    roll: data.readUInt16LE(0),
    pitch: data.readUInt16LE(2),
    yaw: data.readUInt16LE(4),
    throttle: data.readUInt16LE(6),
    aux1: data.readUInt16LE(8),
    aux2: data.readUInt16LE(10),
    aux3: data.readUInt16LE(12),
    aux4: data.readUInt16LE(14)
  };
};