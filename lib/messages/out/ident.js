
var types = [
  'UNKNOWN',
  'TRI',
  'QUADP',
  'QUADX',
  'BI',
  'GIMBAL',
  'Y6',
  'HEX6',
  'FLYING_WING',
  'Y4',
  'HEX6X',
  'OCTOX8',
  'OCTOFLATP',
  'OCTOFLATX'
];

exports.messageId = 100;

exports.parse = function(data) {
  return {
    version: data.readInt8(0),
    multitype: types[data.readInt8(1)],
    mspVersion: data.readInt8(2),
    capability: data.readInt32LE(3)
  };
};