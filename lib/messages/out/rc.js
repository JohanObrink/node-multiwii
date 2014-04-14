
exports.messageId = 105;

exports.parse = function(data) {
  return {
    roll: data.readInt16LE(0),
    pitch: data.readInt16LE(2),
    yaw: data.readInt16LE(4),
    throttle: data.readInt16LE(6),
    aux1: data.readInt16LE(8),
    aux2: data.readInt16LE(10),
    aux3: data.readInt16LE(12),
    aux4: data.readInt16LE(14)
  };
};