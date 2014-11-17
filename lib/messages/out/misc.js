
exports.messageId = 114;

exports.parse = function (data) {
  return {
    powerTrigger: data.readUInt16LE(0)
  };
};