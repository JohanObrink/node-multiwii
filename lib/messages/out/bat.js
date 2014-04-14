
exports.messageId = 110;

exports.parse = function (data) {
  return {
    vbat: data.readInt8(0),
    intPowerMeterSum: data.readInt16LE(1)
  };
};