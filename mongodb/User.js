var mongoose = require('./db');

Schema = mongoose.Schema;

var userSchema = new Schema({
    user_name:String,
    email:String,
    password:String,
    last_login_time:String,
    last_login_ip:String,
    user_type:String,
    friends:[
        {   group_name:String,
            list:[
                    { friend_id:String}
                ]}
    ],
    chat_group:[
        {
            group_id:String,

        }
    ]
});



var userModel = mongoose.model('User',userSchema);


module.exports = {
	userSchema,
	userModel,
}