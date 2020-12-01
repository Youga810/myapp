const fs = require('fs');
const cryptico = require('cryptico');
const secp256k1 = require('secp256k1');
const crypto = require('crypto');

const user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf8'));

var CA = {};
CA.login = function (id, password) {
  var login_flag = false;
  user_data.forEach(element => {
    if (id == element.id && password == element.password) {
      login_flag = true;
    }
  });
  return login_flag;
}


CA.verify = function (publicKey, signature) {
  //console.log(publicKey);
  //console.log(signature);
  //const verify = crypto.createVerify('SHA256');
  //verify.update('some data to sign');
  //verify.end();
  //console.log(verify.verify(publicKey, signature, 'hex'));
}
//CA.create_private_key = function (id) {
//  const bits = 2048;
//  const key = cryptico.generateRSAKey(id, bits);
//  return key;
//}
//
//CA.create_publickey = function (private_key) {
//  var public_key = cryptico.publicKeyString(private_key)
//  return public_key;
//}

module.exports = CA;