
exports.messageId = 108;

exports.parse = function (data) {
  return {
    angles: [
      data.readInt16LE(0),
      data.readInt16LE(2)
    ],
    heading: data.readInt16LE(4),
    headFreeModeHold: data.readInt16LE(6)
  };
};