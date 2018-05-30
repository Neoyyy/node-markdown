
/**
 * Module dependencies.
 */

var app = require('./frame/app');
var http = require('http');
var logger = require("./frame/log/logger");
var socketSerice = require("./socket/socket");
var userDao = require('./dao/userDao');
var userService = require('./service/Userservice');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);


var io = require('socket.io')(server);


io.sockets.on('connection', function (socket) {

    var address = socket.handshake.address;
    logger.info(Date()+"new socket connection from " + address);
    socket.on('login',function (userinfo) {
        //用户登陆
        logger.info(Date()+"user login from" + address + " userInfo:" + JSON.stringify(userinfo));
        //socket.emit("loginResult",true);
        var user = socketSerice.login(socket,userinfo).then(user =>{

            logger.info("server result true")
            socket.emit('loginResult',{code:200,user:user});
            //log.info("send login success result")
            //socket.emit('loginResult',{code:200,userid:user.mine.id});
            socketSerice.sendHistoryMsg(socket,user.mine.email);//获取离线消息
        }).catch(err =>{
            logger.info("server err :" + JSON.stringify(err));
            socket.emit('loginResult', {code:300,errMsg:err});
        });

    });
    socket.on('changeUserName',function (userInfo) {
        logger.info("change user name");
        var user = userService.changeUserName(userInfo).then(user =>{
            logger.info("server,change user name success: " + JSON.stringify(user));
            socket.emit('changeUserNameResult', {code:200, userName:userInfo.userName});
        }).catch(err =>{
            logger.error("server,cahnge user name err: " + JSON.stringify(err));
            socket.emit('changeUserNameResult',{code:300, errMsg:err});
        })
    }),
    socket.on('register', function (userInfo) {
        logger.info("user register,userInfo: " + JSON.stringify(userInfo));
        var user = userService.register(userInfo).then(user =>{
            logger.info("server, user register success: " + JSON.stringify(user));
            socket.emit('registerResult', {code:200, userid:user.mine.id});
        }).catch(err =>{
            logger.error("server, register user err: " + JSON.stringify(err));
            socket.emit('registerResult',{code:300, errMsg:err});
        })


    });
    socket.on('logout', function (userId) {

    });

    socket.on('addNewFriend',function (msg) {
        logger.info("add new Friend: " + JSON.stringify(msg));
        userService.addFriend(msg).then(result =>{
            userDao.get({}).then(data =>{
                socket.emit("addNewFriendResult",{code:200, result:data});

            }).catch(err =>{
                socket.emit("addNewFriendResult",{code:300, errMsg:err});

            })

        }).catch(err =>{
            socket.emit("addNewFriendResult",{code:300, errMsg:err});

        });
    })


    socket.on('chat',function (msg) {
        logger.info(Date()+ "say :" + JSON.stringify(msg));
        socketSerice.handleChat(socket, msg);
    })

    socket.on('deleteFriend',function (data) {
        logger.info("delete friend: " + JSON.stringify(data));
        userService.deleteFriend(data).then(result =>{
            socket.emit("deleteFriendResult",{code:200, result:data});
        }).catch(err =>{
            socket.emit("deleteFriendResult",{code:300, errMsg:err});
        });
    })

    socket.on('disconnect', function () {
        var address = socket.handshake.address;
        logger.info(Date() + "disconnect from " + address.address + ":" + address.port);
        //delete sockets[socket];
    })
})


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.info('Listening on ' + bind);
}




