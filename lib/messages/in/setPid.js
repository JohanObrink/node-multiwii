
module.exports = function (roll, pitch, yaw, alt, pos, posr, navr, level, mag) {
  var msg = new Buffer(27);

  msg.writeInt8(roll.p, 0);
  msg.writeInt8(roll.i, 1);
  msg.writeInt8(roll.d, 2);

  msg.writeInt8(pitch.p, 3);
  msg.writeInt8(pitch.i, 4);
  msg.writeInt8(pitch.d, 5);

  msg.writeInt8(yaw.p, 6);
  msg.writeInt8(yaw.i, 7);
  msg.writeInt8(yaw.d, 8);

  msg.writeInt8(alt.p, 9);
  msg.writeInt8(alt.i, 10);
  msg.writeInt8(alt.d, 11);

  msg.writeInt8(pos.p, 12);
  msg.writeInt8(pos.i, 13);
  msg.writeInt8(pos.d, 14);

  msg.writeInt8(posr.p, 15);
  msg.writeInt8(posr.i, 16);
  msg.writeInt8(posr.d, 17);

  msg.writeInt8(navr.p, 18);
  msg.writeInt8(navr.i, 19);
  msg.writeInt8(navr.d, 20);

  msg.writeInt8(level.p, 21);
  msg.writeInt8(level.i, 22);
  msg.writeInt8(level.d, 23);

  msg.writeInt8(mag.p, 24);
  msg.writeInt8(mag.i, 25);
  msg.writeInt8(mag.d, 26);

  return { id: 202, data: msg };
};