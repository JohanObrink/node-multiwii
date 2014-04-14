
exports.messageId = 114;

exports.parse = function (data) {
  return {
    powerTrigger: data.readInt16LE(0)
  };
};