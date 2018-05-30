var mongoose = require('./db');

Schema = mongoose.Schema;

var articleSchema = new Schema({
    articleid:String
    ,title:String
    ,ownerip:String
    ,owneremail:String
    ,content:String
    ,time:String
    ,authtype:String//文章权限标识
    ,userlist:[]//被分配权限的用户列表


});



var articleModel = mongoose.model('Articles',articleSchema);


module.exports = {
	articleSchema,
	articleModel,
}