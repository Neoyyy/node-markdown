var mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost/markdown';


mongoose.connect(DB_URL, {
  useMongoClient: true,
  /* other options */
});

mongoose.connection.on('connected',function(){
    console.log("connected!!!");
});

mongoose.connection.on('error',function(err){
	console.log('mongodb connection err:'+ err);
});

mongoose.connection.on('disconnected',function(err){
	console.log('mongodb connection disconnected' + err);
});

module.exports = mongoose