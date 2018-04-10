var logger = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;


function insert(statements){
    var promise = new Promise(function (resolve, reject) {
        article.create(statements,function (err,doc) {
            if (err){
                logger.error('create article err:' + err);
                reject(err);
            }else{
                logger.info("create article " + doc + "success")
                resolve(doc);
            }

        })
    })
    return promise;
}


function del(statements) {
    var promise = new Promise(function (resolve, reject) {
        article.remove(statements,function (err) {
            if (err){
                logger.error("delete article failed");
                reject(err);
            }
            logger.info("delete article success");
            resolve();
        })
    })
    return promise;
}

function get(statements) {
    var promise = new Promise(function (resolve, reject) {
        logger.info("get article,condition:" + JSON.stringify(statements));
        article.findOne(statements,function (err,docs) {
            if (err){
                reject(err);
            }else{
                logger.info("the article:" + JSON.stringify(docs))
                //logger.info("the article length:"+docs.length)
                resolve(docs);
            }
        })
    })
    return promise;
}

function update(statements) {
    var promise = new Promise(function (resolve,reject) {
        article.update(statements,function (err,doc) {
            if (err){
                reject(err);
            }else{
                resolve(doc);
            }

        })
    })
    return promise;
}




module.exports ={
    insert,
    del,
    get,
    update
}