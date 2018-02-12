
/**
 * Module dependencies.
 */

var app = require('./frame/app');
var http = require('http');
var logger = require("./frame/log/logger");


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
var io = require("socket.io").listen(server);

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

//io.disable('heartbeats')
//io.set('heartbeats', false);
io.set('transports', ['websocket', 'xhr-polling']);
io.set('heartbeat timeout', 5 * 60)
io.set('heartbeat interval', 4 * 60)
io.set('close timeout', 1 * 30);
io.set("log level", 1)
io.set("browser client", false)
io.set("browser client cache", false)
io.set("browser client cache", false)


var sockets = {};

io.on('connection', function (socket) {
    var address = socket.handshake.address;
    logger.info(Date()+"new connection from" + address.address + ":" + address.port);
    socket.on('login',function (userinfo) {
        //用户登陆
        logger.info(Date()+"user login from" + address.address + ":" + address.port);
    })
    
    socket.on('chat',function (msg,ack) {
        logger.info(Date()+ "say :" + msg);
    })

    socket.on('heartbeats',function (msg,ack) {
        logger.info(Date()+ "heart beat :" + msg);
    })
    socket.on('disconnect', function () {
        var address = socket.handshake.address;
        logger.info(Date() + "disconnect from " + address.address + ":" + address.port);
        delete sockets[socket];
    })
})
