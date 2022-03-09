var Ptouch = require('node-ptouch');

// generate ptouch code
var ptouch = new Ptouch(1, { copies: 2 }); // select template 1 for two copies
ptouch.insertData('myObjectName', 'hello world'); // insert 'hello world' in myObjectName
var data = ptouch.generate();

console.log(data)