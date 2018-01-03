var logger = require('../frame/log/logger');
var user = require('../mongodb/user').userModel;
var responseutil = require('../util/webresponse');


function register(req, callback){
    var userentity = JSON.parse(JSON.stringify(req.body))


    user.find({email:userentity.email},function (err,docs) {
        if (err){
            logger.error('register err:'+err);
            callback(responseutil.createResult(300,'something wrong with server'));
        }
        if (docs.length > 0){
            logger.error('register err: user exist');
            callback(responseutil.createResult(300,'user exist'));

        }else{
            user.create({ user_name:userentity.username, password:userentity.password, email:userentity.email}, function(error,doc){
                if(error) {
                    logger.error('create user error:'+error);
                    callback(responseutil.createResult(300,'create user error'));

                } else {
                    logger.info('create user success:'+doc);
                    callback(responseutil.createResult(200,'create user success'));

                }
            });
        }
    })
}


function login(req, callback) {
    var userentity = JSON.parse(JSON.stringify(req.body))

//TODO 字段无会抛异常
    logger.info("查询doc,email:"+userentity.email)
    user.findOne({email:userentity.email},function(err,doc){
        if (err){
            logger.info('login err:'+err);
            callback(responseutil.createResult(300,'something wrong with server'));
        }

        logger.info("查出的user doc"+doc);
        if (doc.password == userentity.password){
            logger.info('login success');
            callback(responseutil.createResult(200,doc.username));
            doc.last_login_time = new Date();
            doc.last_login_ip = req.ip;
            doc.save(function (error, doc) {
                if (error) {
                    logger.error("error :" + error);
                    throw new Error('update user doc err');
                }
            });
        }else{
            callback(responseutil.createResult(300,'password wrong'));
        }

    })

}

module.exports ={
    login,
    register
};