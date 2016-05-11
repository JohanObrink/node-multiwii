
exports.messageId = 112;

exports.parse = function (data) {
  return {
    roll: { p: data.readUInt8(0), i: data.readUInt8(1), d: data.readUInt8(2) },
    pitch: { p: data.readUInt8(3), i: data.readUInt8(4), d: data.readUInt8(5) },
    yaw: { p: data.readUInt8(6), i: data.readUInt8(7), d: data.readUInt8(8) },
    alt: { p: data.readUInt8(9), i: data.readUInt8(10), d: data.readUInt8(11) },
    pos: { p: data.readUInt8(12), i: data.readUInt8(13), d: data.readUInt8(14) },
    posr: { p: data.readUInt8(15), i: data.readUInt8(16), d: data.readUInt8(17) },
    navr: { p: data.readUInt8(18), i: data.readUInt8(19), d: data.readUInt8(20) },
    level: { p: data.readUInt8(21), i: data.readUInt8(22), d: data.readUInt8(23) },
    mag: { p: data.readUInt8(24), i: data.readUInt8(25), d: data.readUInt8(26) },
    vel: { p: data.readUInt8(27), i: data.readUInt8(28), d: data.readUInt8(29) }
  };
};
