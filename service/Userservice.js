var logger = require('../frame/log/logger');
var user = require('../mongodb/user').userModel;
var responseutil = require('../util/webresponse');
var uuid = require("../util/uuid")

function register(req, callback){
    var userentity = JSON.parse(JSON.stringify(req.body))

    logger.info("register email : " + userentity.email);

    user.find({"mine.email":userentity.email},function (err,docs) {
        if (err){
            logger.error('register err:'+err);
            callback(responseutil.createResult(300,'something wrong with server'));
        }
        if (docs.length > 0){
            logger.error('register err: user exist');
            callback(responseutil.createResult(300,'user exist'));

        }else{
            logger.info("user not exist,create user : " + userentity.email);
            var newUser = {
                mine:{
                    username:userentity.username
                    ,id:uuid.createUUID()
                    ,email:userentity.email
                    ,password:userentity.password
                }
            }
            user.create(newUser, function(error,doc){
                if(error) {
                    logger.error('create user error:'+error);
                    callback(responseutil.createResult(300,'create user error'));

                } else {
                    logger.info('create user success ,uuid : '+doc.mine.id);
                    callback(responseutil.createResult(200,doc));

                }
            });
        }
    })
}


function login(req, callback) {
    var userentity = JSON.parse(JSON.stringify(req.body))

//TODO 字段无会抛异常
    logger.info("查询doc,email:"+userentity.email)
    user.findOne({"mine.email":userentity.email},function(err,doc){
        if (err){
            logger.info('login err:'+err);
            callback(responseutil.createResult(300,'something wrong with server'));
        }

        logger.info("查出的user doc"+doc);
        if (doc.mine.password == userentity.password){
            logger.info('login success');
            doc.last_login_time = new Date();
            doc.last_login_ip = req.ip;
            doc.save(function (error, doc) {
                if (error) {
                    logger.error("error :" + error);
                    throw new Error('update user doc err');
                }
            });
            delete doc.mine.password;//todo pwd没删除成功
            callback(responseutil.createResult(200,doc));

        }else{
            callback(responseutil.createResult(300,'password wrong'));
        }

    })

}

module.exports ={
    login,
    register
};