
exports.messageId = 104;

exports.parse = function(data) {
  return [
    data.readInt16LE(0),
    data.readInt16LE(2),
    data.readInt16LE(4),
    data.readInt16LE(6),
    data.readInt16LE(8),
    data.readInt16LE(10),
    data.readInt16LE(12),
    data.readInt16LE(14)
  ];
};