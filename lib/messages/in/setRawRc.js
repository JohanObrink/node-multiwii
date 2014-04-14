
module.exports = function (roll, pitch, yaw, throttle, aux1, aux2, aux3, aux4) {
  var msg = new Buffer(16);
  msg.writeInt16LE(roll, 0);
  msg.writeInt16LE(pitch, 2);
  msg.writeInt16LE(yaw, 4);
  msg.writeInt16LE(throttle, 6);
  msg.writeInt16LE(aux1, 8);
  msg.writeInt16LE(aux2, 10);
  msg.writeInt16LE(aux3, 12);
  msg.writeInt16LE(aux4, 14);
  return { id: 200, data: msg };
};