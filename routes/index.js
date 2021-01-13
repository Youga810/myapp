var express = require('express');
var app = require('../app');
var router = express.Router();
var ca = require('../ca');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
  console.log('index！');
});



router.get('/vote', function (req, res, next) {
  if (!result_view(res)) {


    var session = req.session;
    if (session.login_flag) {
      res.render('vote', { id: session.user_id });
      console.log(session.user_id);
    } else {
      res.render('error', { message: 'ログインしてください' })

    }
  }
});


router.post('/vote', function (req, res, next) {


  if (!result_view(res)) {


    var session = req.session;
    if (ca.login(req.body.id, req.body.password)) {
      session.user_id = req.body.id;
      session.login_flag = true;
      //var key = ca.create_private_key(session.user_id);
      //秘密鍵、公開鍵作成
      //var private_key = JSON.stringify(key.toJSON());
      //var public_key = ca.create_publickey(key);

      //console.log('秘密鍵：', JSON.stringify(req.body.private_key));
      // console.log('公開鍵：', publicKey);



      res.render('vote',
        {
          id: session.user_id,
          password: req.body.password,
        });
    } else {
      res.redirect('/');

    }
  }
});

router.get('/result_view', function (req, res, next) {
  //current_chain = JSON.stringify(vote.chain)
  //json_chain = JSON.parse(current_chain);

  if (Date.now() > app.end_time) {

    var cnt = vote.cnt();
    res.render('result_view', { vote: vote.chain, cnt: cnt })
  } else {
    res.render('error', { message: '集計中です。', open_time: app.end_time - Date.now() })

  }


});

router.post('/submitted', function (req, res, next) {
  if (!result_view(res)) {


    var session = req.session;
    console.log(req.body.private_key);
    //ca.verify(req.body.publicKey, req.body.signature);
    if (!vote.idcheck(req.body.id)) {

      res.render('submitted', { name: '' });
    } else {
      //電子署名
      //var sign = vote.signTransaction(req.body.candidate, req.body.private_key);
      var sign = req.body.signature;
      var isValid = vote.verifyTransaction(req.body.candidate, sign, session.user_id);
      if (isValid) {
        vote.createNewTransaction(req.body.id, req.body.candidate);
        session.candidate = req.body.candidate;
      } else {
        console.log('電子署名に失敗しました。');
        return res.render('error', { message: '電子署名に失敗しました。' });
      }

      res.render('submitted', { name: req.body.candidate });




      //previous_hash = vote.getLastBlock()['previous_hash']
      console.log(req.body.id);
      //vote.getLastBlock();
      //vote.mining();

      //console.log(vote.getLastBlock()['transaction']);
    }
  }
});

router.get('/submitted', function (req, res, next) {
  var session = req.session;
  console.log(session.candidate)
  if (!vote.idcheck(session.candidate)) {
    res.render('submitted', { name: '' });
  } else {
    res.render('error', { message: '投票してください。' });
  }


});

module.exports = router;


function result_view(res) {
  if (app.end_time < Date.now()) {
    res.redirect('/result_view');
    return true;
  } else return false;
}