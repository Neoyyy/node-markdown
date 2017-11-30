var mongoose = require('./db');

Schema = mongoose.Schema;

var articleSchema = new Schema({
    articleid:Number,
    title:String,
    ownerip:String,
    owneremail:String,
    content:String,
    time:String,
});



var articleModel = mongoose.model('User',userSchema);


module.exports = {
	articleSchema,
	articleModel,
}