var logger = require('../frame/log/logger');
var user = require('../mongodb/user').userModel;
var responseutil = require('../util/webresponse');

function login(userentity, callback) {
    logger.info("查询doc,email:"+userentity.email)
    user.findOne({email:userentity.email},function(err,doc){
        if (err){
            logger.info('login err:'+err);
            callback(responseutil.createResult(300,'no user or something wrong with server'));
        }

        logger.info("查出的user doc"+doc);
        if (doc.password == userentity.password){
            logger.info('login success');
            callback(responseutil.createResult(200,doc.username));
        }else{
            callback(responseutil.createResult(300,'password wrong'));
        }

    })

}

exports.login = login;