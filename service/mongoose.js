var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/markdown');

var user = mongoose.model('user',{
    username:String,
    email:String,
    password:String,
    last_login_time:String,
    last_login_ip:String,
    usertype:String,
});

var article = mongoose.model('article',{
    articleid:Number,
    title:String,
    ownerip:String,
    owneremail:String,
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
            query:{_id: 'articleid' },
            update: {$inc:{sequence_value:1}},
            new:true
        });
    return sequenceDocument.sequence_value;
}


getNextSequenceValue();
getNextSequenceValue();getNextSequenceValue();

