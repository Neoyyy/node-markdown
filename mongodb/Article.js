var mongoose = require('./db');

Schema = mongoose.Schema;

var articleSchema = new Schema({
    article_id:Number,
    title:String,
    owner_ip:String,
    owner_email:String,
    content:String,
    time:String,
    share_code:String,
    permissionType:String,//文章权限标识
    authUserList:Array,//被分配权限的用户列表


});



var articleModel = mongoose.model('Articles',articleSchema);


module.exports = {
	articleSchema,
	articleModel,
}