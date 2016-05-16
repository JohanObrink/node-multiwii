
exports.messageId = 112;

var P = 10, I = 1000, D = 1;

exports.parse = function (data) {
  return {
    roll: { p: data.readUInt8(0) / P, i: data.readUInt8(1) / I, d: data.readUInt8(2) / D },
    pitch: { p: data.readUInt8(3) / P, i: data.readUInt8(4) / I, d: data.readUInt8(5) / D },
    yaw: { p: data.readUInt8(6) / P, i: data.readUInt8(7) / I, d: data.readUInt8(8) / D },
    alt: { p: data.readUInt8(9) / P, i: data.readUInt8(10) / I, d: data.readUInt8(11) / D },
    pos: { p: data.readUInt8(12) / 100, i: data.readUInt8(13) / 100, d: data.readUInt8(14) / 1000 },
    posr: { p: data.readUInt8(15) / 10, i: data.readUInt8(16) / 100, d: data.readUInt8(17) / 1000 },
    navr: { p: data.readUInt8(18) / 10, i: data.readUInt8(19) / 100, d: data.readUInt8(20) / 1000 },
    level: { p: data.readUInt8(21) / P, i: data.readUInt8(22) / I, d: data.readUInt8(23) / D },
    mag: { p: data.readUInt8(24) / P, i: data.readUInt8(25) / I, d: data.readUInt8(26) / D },
    vel: { p: data.readUInt8(27) / P, i: data.readUInt8(28) / I, d: data.readUInt8(29) / D }
  };
};
