var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('./log/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('../routes/index');
var loginService = require('../service/Userservice');

var pandoc = require('node-pandoc');
var { readable } = require('stream');
var marked = require('marked')

var app = express();



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.set('view engine', 'pug');

app.use('/', index);



app.post('/convert',function (req,res) {
    var data = JSON.parse(JSON.stringify(req.body)).msg;
    logger.info('data:'+data);
});




//加载路由
var routerfiles = fs.readdirSync('./routes/');
routerfiles.forEach(function (val,index){
  var router = require('../routes/'+val);
  app.use('/',router);
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
    res.send('404'+err);
});

module.exports = app;
