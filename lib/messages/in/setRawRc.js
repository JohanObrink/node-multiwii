
module.exports = function (roll, pitch, yaw, throttle, aux1, aux2, aux3, aux4) {
  var msg = new Buffer(16);
  msg.writeUInt16LE(roll, 0);
  msg.writeUInt16LE(pitch, 2);
  msg.writeUInt16LE(yaw, 4);
  msg.writeUInt16LE(throttle, 6);
  msg.writeUInt16LE(aux1, 8);
  msg.writeUInt16LE(aux2, 10);
  msg.writeUInt16LE(aux3, 12);
  msg.writeUInt16LE(aux4, 14);
  return { id: 200, data: msg };
};