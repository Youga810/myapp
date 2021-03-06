var express = require('express');
var app = require('../app');
var router = express.Router();
var ca = require('../ca');
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('index！');
  if (req.session) {
    req.session.destroy();
    res.cookie("connect.sid", "", { expires: new Date() });
  }
  res.render('index', { title: 'Express' });

});



router.get('/vote', function (req, res, next) {

  var session = req.session;
  if (!session.user_id) res.redirect('/');
  else {
    if (!vote.idcheck(session.user_id)) {

      res.render('submitted', { id: session.user_id, name: '' });
    } else {
      if (!result_view(res)) {


        if (session.login_flag) {
          res.render('vote', { id: session.user_id });
          console.log(session.user_id);
        } else {
          res.render('error', { message: 'ログインしてください' })

        }
      }
    }
  }

});


router.post('/vote', function (req, res, next) {
  var session = req.session;
  if (!result_view(res)) {
    if (!vote.idcheck(session.user_id)) {

      res.render('submitted', { id: session.user_id, name: '' });
    } else {

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
  }

});

router.get('/result_view', function (req, res, next) {
  //current_chain = JSON.stringify(vote.chain)
  //json_chain = JSON.parse(current_chain);

  if (Date.now() > app.end_time) {




    var cnt = vote.cnt();
    res.render('result_view', { vote: vote.chain, cnt: cnt })
  } else {
    res.render('error', { message: '集計中です', open_time: app.end_time - Date.now() })

  }


});

router.post('/submitted', function (req, res, next) {
  if (!result_view(res)) {
    var session = req.session;

    if (!session.user_id) res.redirect('/');
    else {
      session.signature = req.body.signature;
      session.candidate = req.body.candidate;
      //console.log(req.body.private_key);
      //ca.verify(req.body.publicKey, req.body.signature);
      if (!vote.idcheck(session.user_id)) {

        res.render('submitted', { id: session.user_id, name: '' });
      } else {
        //電子署名
        //var sign = vote.signTransaction(req.body.candidate, req.body.private_key);
        // var sign = req.body.signature;
        var isValid = vote.verifyTransaction(session.candidate, session.signature, session.user_id);
        if (isValid) {
          vote.createNewTransaction(req.body.id, req.body.candidate);
          console.log(vote.transaction_pool);
          console.log(vote.chain);

        } else {
          return res.render('error', { message: '電子署名に失敗しました' });
        }
        res.render('submitted', { id: session.user_id, name: req.body.candidate });




        //previous_hash = vote.getLastBlock()['previous_hash']
        console.log(req.body.id);
        //vote.getLastBlock();
        //vote.mining();

        //console.log(vote.getLastBlock()['transaction']);
      }
    }
  }
});

router.get('/submitted', function (req, res, next) {
  var session = req.session;
  console.log(session.candidate)
  if (!vote.idcheck(session.user_id)) {
    res.render('submitted', { id: req.body.id, name: '' });
  } else {
    res.render('error', { message: '投票してください' });
  }


});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.cookie("connect.sid", "", { expires: new Date() });
  res.render('logout');
});

module.exports = router;


function result_view(res) {
  if (app.end_time < Date.now()) {
    res.redirect('/result_view');
    return true;
  } else return false;
}