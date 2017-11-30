var mongoose = require('./db');

Schema = mongoose.Schema;

var userSchema = new Schema({
    username:String,
    email:String,
    password:String,
    last_login_time:String,
    last_login_ip:String,
    usertype:String,
});



var userModel = mongoose.model('User',userSchema);


module.exports = {
	userSchema,
	userModel,
}