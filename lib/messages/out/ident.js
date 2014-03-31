
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
    version: data.readUInt8(0),
    multitype: types[data.readUInt8(1)],
    subversion: data.readUInt8(2) // what is this?
  };
};