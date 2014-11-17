
exports.messageId = 111;

exports.parse = function (data) {
  return {
    rcRate: data.readUInt8(0),
    rcExpo: data.readUInt8(1),
    rollPitchRate: data.readUInt8(2),
    yawRate: data.readUInt8(3),
    dynThrPID: data.readUInt8(4),
    thrMid: data.readUInt8(5),
    thrExpo: data.readUInt8(6)
  };
};