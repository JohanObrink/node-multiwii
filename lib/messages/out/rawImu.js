
exports.messageId = 102;

exports.parse = function(data) {
  return {
    accSmooth: [
      data.readUInt16LE(0),
      data.readUInt16LE(2),
      data.readUInt16LE(4)
    ],
    gyroData: [
      data.readUInt16LE(6),
      data.readUInt16LE(8),
      data.readUInt16LE(10)
    ],
    magADC: [
      data.readUInt16LE(12),
      data.readUInt16LE(14),
      data.readUInt16LE(16)
    ]
  };
};