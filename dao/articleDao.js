var log = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;


function insert(stateMent){
    var promise = new Promise(function (resolve, reject) {
        article.create(stateMent,function (err,doc) {
            if (err){
                log.error('create article err:' + err);
                reject(err);
            }else{
                log.info("create article success:" + doc);
                resolve(doc);
            }

        })
    })
    return promise;
}


function del(stateMent) {
    var promise = new Promise(function (resolve, reject) {
        article.remove(stateMent,function (err,doc) {
            if (err){
                log.error("delete article failed");
                reject(err);
            }
            log.info("delete article success");
            resolve(doc);
        })
    })
    return promise;
}

function getOne(stateMent) {
    var promise = new Promise(function (resolve, reject) {
        log.info("get article,condition:" + JSON.stringify(statements));
        article.findOne(stateMent,function (err,doc) {
            if (err){
                log.error("get article failed:" + err);
                reject(err);
            }else{
                if (doc != null && JSON.stringify(doc).length >0){
                    log.info("the article:" + JSON.stringify(doc));
                    resolve(doc);
                }else{
                    log.error("get article failed");
                    reject();
                }
            }
        })
    })
    return promise;
}

function getDocs(stateMent) {
    var promise = new Promise(function (resolve, reject) {
        log.info("get article,condition:" + JSON.stringify(statements));
        article.findOne(stateMent,function (err,docs) {
            if (err){
                log.error("get article failed:" + err);
                reject(err);
            }else{
                if (docs != null && JSON.stringify(docs).length >0){
                    log.info("the article:" + JSON.stringify(docs));
                    resolve(docs);
                }else{
                    log.error("get article failed");
                    reject();
                }
            }
        })
    })
    return promise;
}


//todo 未测
function update(stateMent, newEntity) {
    var promise = new Promise(function (resolve,reject) {
        article.update(stateMent, newEntity, function (err,doc) {
            if (err){
                log.error("update article failed:" + err);
                reject(err);
            }else{
                log.info("update article success");
                resolve(doc);
            }

        })
    })
    return promise;
}




module.exports = {
    insert,
    del,
    getDocs,
    getOne,
    update
}