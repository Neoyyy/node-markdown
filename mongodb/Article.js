var mongoose = require('./db');

Schema = mongoose.Schema;

var articleSchema = new Schema({
    article_id:String
    ,title:String
    ,owner_ip:String
    ,owner_email:String
    ,owner_id:String
    ,content:String
    ,time:String
    ,permissionType:String//文章权限标识
    ,authUserList:Array//被分配权限的用户列表


});



var articleModel = mongoose.model('Articles',articleSchema);


module.exports = {
	articleSchema,
	articleModel,
}