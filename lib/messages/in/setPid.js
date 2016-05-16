
var P = 10, I = 1000, D = 1;

module.exports = function (roll, pitch, yaw, alt, pos, posr, navr, level, mag, vel) {
  var msg = new Buffer(30);

  msg.writeUInt8(roll.p * P, 0);
  msg.writeUInt8(roll.i * I, 1);
  msg.writeUInt8(roll.d * D, 2);

  msg.writeUInt8(pitch.p * P, 3);
  msg.writeUInt8(pitch.i * I, 4);
  msg.writeUInt8(pitch.d * D, 5);

  msg.writeUInt8(yaw.p * P, 6);
  msg.writeUInt8(yaw.i * I, 7);
  msg.writeUInt8(yaw.d * D, 8);

  msg.writeUInt8(alt.p * P, 9);
  msg.writeUInt8(alt.i * I, 10);
  msg.writeUInt8(alt.d * D, 11);

  msg.writeUInt8(pos.p * 100, 12);
  msg.writeUInt8(pos.i * 100, 13);
  msg.writeUInt8(pos.d * D, 14);

  msg.writeUInt8(posr.p * 10, 15);
  msg.writeUInt8(posr.i * 100, 16);
  msg.writeUInt8(posr.d * 1000, 17);

  msg.writeUInt8(navr.p * 10, 18);
  msg.writeUInt8(navr.i * 100, 19);
  msg.writeUInt8(navr.d * 1000, 20);

  msg.writeUInt8(level.p * P, 21);
  msg.writeUInt8(level.i * I, 22);
  msg.writeUInt8(level.d * 1000, 23);

  msg.writeUInt8(mag.p * P, 24);
  msg.writeUInt8(mag.i * I, 25);
  msg.writeUInt8(mag.d * D, 26);

  msg.writeUInt8(vel.p * P, 27);
  msg.writeUInt8(vel.i * I, 28);
  msg.writeUInt8(vel.d * D, 29);

  return { id: 202, data: msg };
};
