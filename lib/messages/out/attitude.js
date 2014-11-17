
exports.messageId = 108;

exports.parse = function (data) {
  return {
    angles: [
      data.readUInt16LE(0),
      data.readUInt16LE(2)
    ],
    heading: data.readUInt16LE(4),
    headFreeModeHold: data.readUInt16LE(6)
  };
};