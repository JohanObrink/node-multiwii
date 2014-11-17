
exports.messageId = 103;

exports.parse = function(data) {
  return [
    data.readUInt16LE(0),
    data.readUInt16LE(2),
    data.readUInt16LE(4),
    data.readUInt16LE(6),
    data.readUInt16LE(8),
    data.readUInt16LE(10),
    data.readUInt16LE(12),
    data.readUInt16LE(14)
  ];
};