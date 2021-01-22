var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");

var indexRouter = require('./routes/index');
var submittedRouter = require('./routes/submitted');
var Blockchain = require('./blockchain');
var vote = new Blockchain();
vote.startmining();
//console.log(vote);
console.log('now:', Date.now());
exports.end_time = Date.now() + 864000000;// 24時間後に閉鎖 マイニング終了後に閉鎖
var app = express();

//session使用
app.use(session({
  secret: "secret word",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000 * 24//クッキーを24時間に指定
  }
}));



const port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/submitted', submittedRouter);

// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//  next(createError(404));
//});
//
// error handler
//app.use(function (err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
