var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
var Blockchain = require('../blockchain');
vote = new Blockchain();

app.use(bodyParser.json()); // to support JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

/* GET users listing. */
//app.js:25で呼ばれ、users/フォルダのみ作動するという意味

//router.get('/', function (req, res, next) {
//  //current_chain = JSON.stringify(vote.chain)
//  //json_chain = JSON.parse(current_chain);
//  res.render('submitted', { name: '投稿されてない' });
//
//});

//router.post('/', function (req, res, next) {
//  //console.log(req.body.name);
//  if (!vote.idcheck(req.body.name)) {
//
//    res.render('submitted', { name: '' });
//  }
//  vote.createNewTransaction(req.body.name, req.body.candidate);
//
//  //console.log(vote.transaction_pool);
//  //previous_hash = vote.getLastBlock()['previous_hash']
//  console.log('EEE');
//  //vote.getLastBlock();
//  //vote.mining();
//  res.render('submitted', { name: req.body.candidate });
//  //console.log(vote.getLastBlock()['transaction']);
//});

module.exports = router;