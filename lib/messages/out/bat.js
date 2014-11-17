
exports.messageId = 110;

exports.parse = function (data) {
  return {
    vbat: data.readUInt8(0),
    intPowerMeterSum: data.readUInt16LE(1)
  };
};