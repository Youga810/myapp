const sha256 = require('sha256');
var rs = require('jsrsasign');
var rsu = require('jsrsasign-util');
const fs = require('fs');
var app = require('../app');
class Blockchain {
  constructor() {
    this.chain = [];
    this.transaction_pool = [];
    this.createNewBlock('', 0, 0) //genesisブロックの生成
  }
  createNewBlock(previous_hash, nonce = 100, hash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transaction: this.transaction_pool,
      nonce: nonce,
      hash: hash,
      previous_hash: previous_hash
    }
    this.transaction_pool = []
    this.chain.push(newBlock);
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(voterid, candidate) {
    var newTransaction = {
      voterid: voterid,
      candidate: candidate
    }
    this.transaction_pool.push(newTransaction);
  }

  hashBlock(previous_hash, currentBlockData, nonce) {
    const dataAsString = previous_hash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
  }

  pOW(previous_hash, currentBlockData) {
    var nonce = 0;
    var hash = this.hashBlock(previous_hash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(previous_hash, currentBlockData, nonce);
    }
    return nonce;
  }

  startmining() {
    //var self = this;
    //console.log(this);
    var start = setInterval(() => {
      //console.log(JSON.stringify(vote));
      if (vote.transaction_pool.length != 0 && Date.now() < app.end_time) {
        vote.mining();
      }
    }, 5000)

  }

  //マイニング処理  
  mining() {

    const previous_hash = this.getLastBlock()['hash'];
    const currentBlockData = {
      transaction: this.transaction_pool,
      index: this.getLastBlock()['index'] + 1
    }
    const nonce = this.pOW(previous_hash, currentBlockData);

    const blockhash = this.hashBlock(
      previous_hash,
      currentBlockData,
      nonce
    )
    const newBlock = this.createNewBlock(previous_hash, nonce, blockhash)
  }
  cnt() {
    var a_num = 0;
    var b_num = 0;
    for (var key in this.chain) {
      for (var value in this.chain[key]["transaction"]) {
        if (this.chain[key]["transaction"][value]["candidate"] == "A") {
          a_num++;
        }
        else b_num++;
      }
    }
    //a_num /= 2;
    //b_num /= 2;
    return { a_num, b_num };
  }
  idcheck(id) {
    for (var key in this.chain) {
      for (var value in this.chain[key]["transaction"]) {
        console.log(this.chain[key]["transaction"][value]);
        if (this.chain[key]["transaction"][value]["voterid"] == id) {
          return false;
        }
      }
    }
    return true;
  }
  //クライアント側で計算させないと盗聴の恐れあり
  //signTransaction(candidate, private_key) {
  //  //signature作成
  //  var rsa = new rs.RSAKey();
  //  rsa.readPrivateKeyFromPEMString(private_key);
  //  var hashAlg = 'sha1';
  //  var hSig = rsa.sign(candidate, hashAlg);
  //  return rs.linebrk(hSig, 64);
  //}



  verifyTransaction(candidate, hsig, id) {
    //jsonデータをそのまま読み込む
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf8'));
    var publickey;
    console.log("id", id);
    user_data.forEach(element => {
      if (id == element.id) publickey = element.publickey;
    });
    console.log(publickey);
    var pubKey = rs.KEYUTIL.getKey(publickey);
    return pubKey.verify(candidate, hsig);
  }

}

module.exports = Blockchain;


