
exports.messageId = 112;

exports.parse = function (data) {
  return {
    roll: { p: data.readInt8(0), i: data.readInt8(1), d: data.readInt8(2) },
    pitch: { p: data.readInt8(3), i: data.readInt8(4), d: data.readInt8(5) },
    yaw: { p: data.readInt8(6), i: data.readInt8(7), d: data.readInt8(8) },
    alt: { p: data.readInt8(9), i: data.readInt8(10), d: data.readInt8(11) },
    pos: { p: data.readInt8(12), i: data.readInt8(13), d: data.readInt8(14) },
    posr: { p: data.readInt8(15), i: data.readInt8(16), d: data.readInt8(17) },
    navr: { p: data.readInt8(18), i: data.readInt8(19), d: data.readInt8(20) },
    level: { p: data.readInt8(21), i: data.readInt8(22), d: data.readInt8(23) },
    mag: { p: data.readInt8(24), i: data.readInt8(25), d: data.readInt8(26) }
  };
};