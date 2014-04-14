
exports.messageId = 102;

exports.parse = function(data) {
  return {
    accSmooth: [
      data.readInt16LE(0),
      data.readInt16LE(2),
      data.readInt16LE(4)
    ],
    gyroData: [
      data.readInt16LE(6),
      data.readInt16LE(8),
      data.readInt16LE(10)
    ],
    magADC: [
      data.readInt16LE(12),
      data.readInt16LE(14),
      data.readInt16LE(16)
    ]
  };
};