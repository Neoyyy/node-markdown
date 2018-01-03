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
});



var articleModel = mongoose.model('Articles',articleSchema);


module.exports = {
	articleSchema,
	articleModel,
}