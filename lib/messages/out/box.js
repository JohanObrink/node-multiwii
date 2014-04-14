
exports.messageId = 113;

var names = [
  'ACC',
  'BARO',
  'MAG',
  'CAMSTAB',
  'CAMTRIG',
  'ARM',
  'GPS HOME',
  'GPS HOLD',
  'PASSTHRU',
  'HEADFREE',
  'BEEPER',
  'LEDMAX',
  'LLIGHTS',
  'HEADADJ'
];

exports.parse = function (data) {
  return {
    checkboxItems: names.reduce(function (obj, name, ix) {
      obj[name] = data.readUInt16LE(ix*2);
      return obj;
    }, {})
  };
};