node-multiwii (pre alpha!)
===========================

A library for sending and parsing messages to/from a MultiWii device using Node.js

###Add
```javascript
npm install multiwii
```

###Use
```javascript
var Wii = require('wii').Wii;
var wii = new Wii();

Wii.list().then(function (devices) {
  devices.forEach(function (device) {
    if(device.productId === '0x8036') { // NanoWii
      wii.connect(device).then(function () {
      
        console.log('Yay, connected!');
      
        var roll = 1200,
          pitch = 1600,
          yaw = 700,
          throttle = 1100,
          aux1 = 1000,
          aux2 = 2000,
          aux3 = 1500,
          aux4 = 1350;
        
        wii.on('rc', function (rcData) {
          console.log('rc', rcData);
        });
      
        wii.setRawRc(roll, pitch, yaw, throttle, aux1, aux2, aux3, aux4).then(function () {
          wii.read('rc');
        });
      });
    }
  });
});
```
