
exports.messageId = 115;

exports.parse = function (data) {
  return [
    data.readInt8(0),
    data.readInt8(1),
    data.readInt8(2),
    data.readInt8(3),
    data.readInt8(4),
    data.readInt8(5),
    data.readInt8(6),
    data.readInt8(7)
  ];
};