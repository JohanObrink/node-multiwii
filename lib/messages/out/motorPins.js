
exports.messageId = 115;

exports.parse = function (data) {
  return [
    data.readUInt8(0),
    data.readUInt8(1),
    data.readUInt8(2),
    data.readUInt8(3),
    data.readUInt8(4),
    data.readUInt8(5),
    data.readUInt8(6),
    data.readUInt8(7)
  ];
};