
module.exports = function (roll, pitch, yaw, alt, pos, posr, navr, level, mag) {
  var msg = new Buffer(27);

  msg.writeUInt8(roll.p, 0);
  msg.writeUInt8(roll.i, 1);
  msg.writeUInt8(roll.d, 2);

  msg.writeUInt8(pitch.p, 3);
  msg.writeUInt8(pitch.i, 4);
  msg.writeUInt8(pitch.d, 5);

  msg.writeUInt8(yaw.p, 6);
  msg.writeUInt8(yaw.i, 7);
  msg.writeUInt8(yaw.d, 8);

  msg.writeUInt8(alt.p, 9);
  msg.writeUInt8(alt.i, 10);
  msg.writeUInt8(alt.d, 11);

  msg.writeUInt8(pos.p, 12);
  msg.writeUInt8(pos.i, 13);
  msg.writeUInt8(pos.d, 14);

  msg.writeUInt8(posr.p, 15);
  msg.writeUInt8(posr.i, 16);
  msg.writeUInt8(posr.d, 17);

  msg.writeUInt8(navr.p, 18);
  msg.writeUInt8(navr.i, 19);
  msg.writeUInt8(navr.d, 20);

  msg.writeUInt8(level.p, 21);
  msg.writeUInt8(level.i, 22);
  msg.writeUInt8(level.d, 23);

  msg.writeUInt8(mag.p, 24);
  msg.writeUInt8(mag.i, 25);
  msg.writeUInt8(mag.d, 26);

  return { id: 202, data: msg };
};