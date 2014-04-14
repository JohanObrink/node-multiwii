
exports.messageId = 111;

exports.parse = function (data) {
  return {
    rcRate: data.readInt8(0),
    rcExpo: data.readInt8(1),
    rollPitchRate: data.readInt8(2),
    yawRate: data.readInt8(3),
    dynThrPID: data.readInt8(4),
    thrMid: data.readInt8(5),
    thrExpo: data.readInt8(6)
  };
};