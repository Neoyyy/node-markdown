var mongoose = require('./db');

Schema = mongoose.Schema;

var userSchema = new Schema({

    mine:{
      username:String//昵称
      ,id:String
      ,avatar:String//头像
      ,email:String//注册邮件
      ,password:String//密码
        ,status: String //在线状态 online：在线、hide：隐身
        ,sign: String //我的签名
        ,avatar: String //我的头像
    }

    ,friend:[{
        groupname:String//分组名称
        ,id:String//分组id
        ,list:[{
            username:String//好友昵称
            ,email:String
            ,id:String//好友id
            ,avatar:String//好友头像
            ,sign:String//签名

        }]
    }]
});



var userModel = mongoose.model('User',userSchema);


module.exports = {
	userSchema,
	userModel,
}