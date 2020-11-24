var crypt = require('jsencrypt.min.js');

var planetext = 'test';
var encedtxt = crypt.encrypt(planetext);

console.log(encedtxt);