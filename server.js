
/**
 * Module dependencies.
 */

var app = require('./frame/app');
var http = require('http');
var logger = require("./frame/log/logger");
var socketSerice = require("./socket/socket")

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
        socketSerice.login(socket,userinfo);
    })

    socket.on('chat',function (msg,ack) {
        logger.info(Date()+ "say :" + msg);
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




