var redis = require("redis");
var conf = require("../conf/redis");
var logger = require("../frame/log");


redis.createClient(conf.port, conf.host);
redis.auth(conf.auth);
redis.on("error",function (err) {
    logger.error("redis error:"+err);
});


function keys(key, callback){
    keys(ley, callback);
}

function get(key, callback) {
    redis.get(key, callback);
}

function set(key, value, callback) {
    redis.set(key, value, callback);
}

function expires(key, interval) {
    redis.expire(key, interval);
}

function del(key, callback){
    redis.del(key,callback);
}


module.exports = {
    keys,
    get,
    set,
    expires,
    del
};