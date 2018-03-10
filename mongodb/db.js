var mongoose = require('mongoose');
var logger = require("../frame/log/logger");
var mongodbConf = require("../conf/db");

mongoose.connect(mongodbConf.url, {
  useMongoClient: true,
  /* other options */
});

mongoose.connection.on('connected',function(){
    logger.info("mongodb connected!!!");
});

mongoose.connection.on('error',function(err){
	logger.error('mongodb connection err:'+ err);
});

mongoose.connection.on('disconnected',function(err){
	logger.error('mongodb connection disconnected' + err);
});

module.exports = mongoose