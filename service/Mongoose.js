var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/markdown');

var user = mongoose.model('user',{
    username:String,
    email:String,
    password:String,
    last_login_time:String,
    last_login_ip:String,
    user_type:String,
});

var article = mongoose.model('article',{
    article_id:Number,
    title:String,
    owner_ip:String,
    owner_email:String,
    content:String,
    time:String,
});

var counter = mongoose.model('counter',{
    _id:String,
    sequence_value:Number,
});

function getNextSequenceValue(){
    var sequenceDocument = db.counters.findAndModify(
        {
            query:{_id: 'article_id' },
            update: {$inc:{sequence_value:1}},
            new:true
        });
    return sequenceDocument.sequence_value;
}

