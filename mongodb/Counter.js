var mongoose = require('./db');

Schema = mongoose.Schema;

var counterSchema = new Schema({
    _id:String,
    sequence_value:Number,
});

counterSchema.methods.getNextSequence = function(callback){
	this.model('Counter').update({_id:'articleid'},{$inc:{sequence_value:1}},function(err,doc){
		if(err){
			console.log('err:'+err);
		}
		mongoose.model('Counter').findById('articleid',callback);
	});
}


var counterModel = mongoose.model('Counter',counterSchema);


module.exports = {
	counterSchema,
	counterModel,
}