var redis = require("redis");
var conf = require("../conf/redis");
var logger = require("../frame/log");


function RedisCache() {
    if (this._redis){
        this._redis = this._redis;
    }else{
        this._redis = redis.createClient(conf.port, conf.host);
        this._redis.auth(conf.auth);
        this._redis.on("error",function (err) {
            logger.error("redis error:"+err);
        })
    }
}

Cache.prototype.keys = function (key, callback) {
    this._redis.keys(key,callback);
}

Cache.prototype.get = function (key, callback) {
    this._redis.get(key, callback);
}

Cache.prototype.set = function (key, value, callback) {
    this._redis.set(key, value, callback);
}

Cache.prototype.expires = function (key, interval) {
    this._redis.expire(key, interval);
}

Cache.prototype.delete = function (key, callback) {
    this._redis.del(key,callback);
}

Cache.prototype.newCache = new RedisCache();

module.exports = Cache;