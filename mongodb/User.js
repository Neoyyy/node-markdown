var mongoose = require('./db');

Schema = mongoose.Schema;

var userSchema = new Schema({

    mine:{
      username:String//昵称
      ,id:String
      ,avatar:String//头像
      ,email:String//注册邮件
      ,password:String//密码
    }

    ,friend:[{
        groupname:String//分组名称
        ,id:String//分组id
        ,list:[{
            username:String//好友昵称
            ,id:String//好友id
            ,avatar:String//好友头像
            ,sign:String//签名

        }]
        ,group:[{
            groupname:String//群组名称
            ,id:String//群组id
            ,avatar:String//群组头像
        }]

    }]
});



var userModel = mongoose.model('User',userSchema);


module.exports = {
	userSchema,
	userModel,
}