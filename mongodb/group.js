var mongoose = require('./db');

Schema = mongoose.Schema;

var userGroupSchema = new Schema({
    group_id:String,
    group_name:String,
    menber_id:[
        {
            member_id:String,
            menber_name:String,

        }
    ]
});



var userGroupModel = mongoose.model('UserGroup',userGroupSchema);


module.exports = {
    userGroupSchema,
    userGroupModel,
}