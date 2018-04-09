var redis = require("redis");
var conf = require("../conf/redis");
var logger = require("../frame/log/logger");


client = redis.createClient(conf.port, conf.host);
client.auth(conf.auth,function (err) {
    if (err){
        logger.error("redis auth err:"+err);
    }
    else{
        logger.info("redis auth success");
    }
});
client.on("error",function (err) {
    logger.error("redis error:"+err);
});


function keys(key, callback){
    client.keys(ley, callback);
}

function get(key, callback) {
    client.get(key, callback);
}

function set(key, value, callback) {
    client.set(key, value, callback);
}

function expires(key, interval) {
    client.expire(key, interval);
}

function del(key, callback){
    client.del(key,callback);
}


module.exports = {
    keys,
    get,
    set,
    expires,
    del
};