var log = require('../frame/log/logger');
var user = require('../mongodb/User').userModel;

function insert(stateMent) {
    var promise = new Promise(function (resolve, reject) {
        user.create(stateMent, function (err, doc) {
            if (err){
                log.error('create user err:' + err);
                reject(err);
            }else{
                log.info("create user success," + doc);
                resolve(doc);
            }
        })
    });
    return promise;
}

function get(stateMent) {
    var promise = new Promise(function (resolve, reject) {
        user.findOne(stateMent,function (err,doc) {
            if (err){
                log.error("get user failed:" + err);
                reject(err);
            }else{
                if (doc != null && JSON.stringify(doc).length>0){
                    resolve(doc);
                }else{
                    log.error("not find user");
                    reject();
                }
            }
        })
    });
    return promise;
}

function del(stateMent) {
    var promise = new Promise(function (resolve, reject) {
        user.remove(stateMent,function (err,doc) {
            if (err){
                log.error("delete user failed");
                reject(err);
            }
            log.info("delete user success");
            resolve(doc);
        })
    });
    return promise;
}

//todo 未测
function update(stateMent, newEnticy) {
    var promise = new Promise(function (resolve, reject) {
        user.update(stateMent, newEnticy, function (err,doc) {
            if (err){
                log.error("update user failed:" + err);
                reject(err);
            }else{
                log.info("update user success");
                resolve(doc);
            }

        })
    });
    return promise;
}

module.exports = {
    update,
    del,
    get,
    insert

}