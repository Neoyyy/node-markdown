var redis = require("redis");
var conf = require("../conf/redis");
var log = require("../frame/log/logger");
var {promisify} = require('util');


client = redis.createClient(conf.port, conf.host);
client.auth(conf.auth,function (err) {
    if (err){
        log.error("redis auth err:"+err);
    }
    else{
        log.info("redis auth success");
    }
});
client.on("error",function (err) {
    log.error("redis error:"+err);
});

function get() {
    
}


async function getHistory(userId) {

    return await client.hgetAsync('historyMsg', userId).catch(err =>{
        log.error("get history msg err: " + err);
    })

}

function addHistory(userId, msg) {
    if (hexistsAsync(userId) == 0){
        hsetAsync('historyMsg', userId, [msg]);
    }else{
        var historyMsg = this.getHistory(userId);
        historyMsg.push(msg);
        hsetAsync('historyMsg', userId, historyMsg);
    }


}

async function getDelayMsg(userId) {
    return await client.hgetAsync('delayMsg', userId).catch(err =>{
        log.error("get history msg err: " + err);
    })
}

function addDelayMsg(userId, msg) {
    if (hexistsAsync(userId) == 0){
        hsetAsync('delayMsg', userId, [msg]);
    }else{
        var historyMsg = this.getHistory(userId);
        historyMsg.push(msg);
        hsetAsync('delayMsg', userId, historyMsg);
    }
}


module.exports = {
    getHistory,
    addHistory,
    getDelayMsg,
    addDelayMsg,
    getAsync,
    setAsync,
    delAsync,
    keysAsync,
    expiresAsync,
    hsetAsync,
    hgetAsync

};