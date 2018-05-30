var createClient = require('then-redis').createClient
var conf = require('../conf/redis.json')
var log = require("../frame/log/logger");

const db = createClient({
    host: conf.host,
    port: conf.port,
    password: conf.auth
})


function set(key, value) {
    return new Promise(function (resolve, reject) {
        log.info("redis set key :" + key + "value :" + value);
        db.set(key, value).catch(err =>{
            log.error("redis set err :" + err);
            reject(err);
        })
        log.info("redis set key :" + key + "value :" + value + "success");
        resolve();
    })

}

function get(key) {
    return new Promise(function (resolve, reject) {
        log.info("redis get , key: " + key);
        db.get(key).then(function (values) {
            log.info("redis get , key: " + key + "success");
            resolve(values);
        }).catch(err =>{
            log.error("redis get , key: " + key + " err: " + err);
            reject(err);
        })
    })

}

function mapSet(stateMent) {
    return new Promise(function (resolve, reject) {
        log.info("redis map set, value: " + JSON.stringify(stateMent));
        db.mset(stateMent).then(function (value) {
            log.info("redis map set, value: " + JSON.stringify(stateMent) + " success");
            resolve();
        }).catch(err =>{
            log.error("redis map set, value: " + JSON.stringify(stateMent) + "err :" + err);
            reject(err);
        })
    })
}

function mapGet(keys) {
    return new Promise(function (resolve, reject) {
        log.info("redis map get, keys: " + keys);
        db.mget(keys).then(function (values) {
            log.info("redis map get, keys: " + keys + " success");
            resolve(values);
        }).catch(err =>{
            log.info("redis map get, keys: " + keys + " err: " + err);
            reject(err);
        })
    })    
}


function hashMapSet(key, hashMap) {
    return new Promise(function (resolve, reject) {
        log.info("redis hash map set, keys: " + key + " ,hashMap: " + JSON.stringify(hashMap));
        db.hmset(key, hashMap).then(() =>{
            log.info("redis hash map set, keys: " + key + " ,hashMap: " + JSON.stringify(hashMap) + " success");
            resolve();
        }).catch(err =>{
            log.error("redis hash map set, keys: " + key + " ,hashMap: " + JSON.stringify(hashMap) + " err: " + err);
            reject(err);
        })
    })
}

function hashMapGet(key) {
    return new Promise(function (resolve, reject) {
        log.info("redis hash get ,key: " + key);
        db.hmget('chatHistory',key).then(function (hash){
            log.info("redis hash get ,key: " + key + " success");
            resolve(hash);
        }).catch(err =>{
            log.info("redis hash get ,key: " + key + " err: " + err);
            reject(err);
        })
    })
}


async function setChatHistory(toUserId, msg) {
    var Msg = JSON.stringify(msg);
    var historyHash = await hashMapGet('chatHistory').catch(err =>{
        log.error("setChatHistory ,get err: " + err);
    });
    if (historyHash){
        log.info("the history hash: " + JSON.stringify(historyHash));
        if (historyHash.hasOwnProperty(toUserId)){
            log.info("typeof :" + typeof historyHash[toUserId])
            historyHash[toUserId].push(Msg);
            return hashMapSet('chatHistory', historyHash);

        }else{
            historyHash[toUserId] = [Msg];
            hashMapSet('chatHistory', historyHash).then(hash =>{
                return hash;
            })
        }

    }else{
        var hashMap = new Object();
        hashMap[toUserId] = [Msg];
        hashMapSet('chatHistory', hashMap).then(hash =>{
            return hash;
        })
    }
}

async function getChatHistory(userid) {
    log.info("redis start get chatHistory, userId: " + userid);
    var Msg = await hashMapGet(userid).catch(err =>{
        log.info("redis get chatHistory, userId: " + userid + " ,err: " + err);
        throw err;
    });
    log.info("redis get chatHistory, userId: " + userid + ", Msg: " + JSON.stringify(Msg));
    return Msg;
}
module.exports = {
    setChatHistory,
    getChatHistory

};