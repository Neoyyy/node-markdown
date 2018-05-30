var log = require('../frame/log/logger');
var userDao = require('../dao/userDao');
var responseutil = require('../util/webresponse');
var uuid = require("../util/uuid")

async function register(reqEntity) {
    log.info("user register:" + reqEntity.email);
    var user = await userDao.getForRegister({"mine.email":reqEntity.email}).catch(err =>{
        log.error("register err: " + err);
        throw 'register user failed';
    });
    if (user == undefined || JSON.stringify(user).length <= 0){
        reqEntity.id = uuid.createUUID();
        return userDao.insert({mine:reqEntity}).catch(err =>{
            log.error("register err: " + err);
            throw 'register user failed'
        })
    }else{
        log.error("register err, user exist");
        throw 'user exist';
    }
}


async function login(reqEntity) {
    log.info("user login1:" + reqEntity.email);
    var user = await userDao.get({"mine.email":reqEntity.email}).catch(err =>{
        log.error("can't get user info for login check, err: " + err);
        throw 'can\'t login';
    });
    log.info("22222user " + JSON.stringify(user.mine) + " login");
    log.info("22222user " + typeof user.mine + " login");

    if (user != undefined && JSON.stringify(user).length > 0){
        log.info("3333user " + user.mine.password + " login");
        log.info("3333logon " + reqEntity.password + " login");
        var userInfo = user.mine
        if (userInfo.password == reqEntity.password){
            log.info("111111  login");

            log.info("111111user " + reqEntity.email + " login");
                log.info(user)
                return user;
            }else{
            log.error("password wrong")
            throw 'password wrong';
        }
        }else{
            log.error("user not exist, can't login");
            throw 'user not exist';
        }


}


async function addFriend(reqEntity) {

    log.info("add new friend: " + JSON.stringify(reqEntity))
    var user = await userDao.get({"mine.email":reqEntity.myemail}).catch(err =>{
        log.error("can't find user, err: " + err);
        throw 'can\'t find user';
    })
    var friendDetail = await userDao.get({"mine.email":reqEntity.friendemail}).catch(err =>{
        log.error("can't find user, err: " + err);
        throw 'can\'t find user';
    })
    log.info("the user : " + JSON.stringify(user))
    var friendList = user.friend;
    var flag = 0;
    for(var j = 0;j<friendList.length;j++){
        if (reqEntity.groupid == friendList[j].groupname){
            flag = 1;
            log.info("fin the froup");
            friendList[j].list.push(friendDetail.mine)

        }
    }
    if (flag == 0){
        friendList.push({
            "groupname":reqEntity.groupid
            ,"id": uuid.createUUID()
            ,"list": [friendDetail.mine]
        })
    }

    log.info("处理完了 "+JSON.stringify(friendList))
    return await userDao.update({'mine.email':reqEntity.myemail},{$set : { friend : friendList }}).catch(err=>{
        throw err;
    })


}
async function changeUserName(reqEntity) {

    return await userDao.update({'mine.email':reqEntity.email},{$set : { 'mine.username' : reqEntity.userName }}).catch(err=>{
        throw err;
    })
}


async function deleteFriend(reqEntity) {

    var user = await userDao.get({'mine.email':reqEntity.myemail}).catch(err=>{
        throw err;
    });
    var friendList = user.friend;
    log.info("处理前" + JSON.stringify(friendList))
    for(var j = 0;j<friendList.length;j++){
        if (reqEntity.groupid == friendList[j].groupname){
            log.info("fin the froup");
            log.info("the " + j + "group");
            log.info(friendList[j])
            for(var i = 0;i<friendList[j].list.length;i++){
                log.info(friendList[j].list[i])
                var aaa = JSON.parse(JSON.stringify(friendList[j].list[i]));
                log.info("the aaa is: " + aaa);
                if (reqEntity.friendemail == aaa.email){
                    log.info("find user")
                    friendList[j].list.splice(i,1);
                }
            }
        }
    }

    log.info("处理完了 "+JSON.stringify(friendList))
    return await userDao.update({'mine.email':reqEntity.myemail},{$set : { friend : friendList }}).catch(err=>{
        throw err;
    })

}

// function register(req, callback){
//     var userentity = JSON.parse(JSON.stringify(req.body))
//
//     logger.info("register email : " + userentity.email);
//
//     user.find({"mine.email":userentity.email},function (err,docs) {
//         if (err){
//             logger.error('register err:'+err);
//             callback(responseutil.createResult(300,'something wrong with server'));
//         }
//         if (docs.length > 0){
//             logger.error('register err: user exist');
//             callback(responseutil.createResult(300,'user exist'));
//
//         }else{
//             logger.info("user not exist,create user : " + userentity.email);
//             var newUser = {
//                 mine:{
//                     username:userentity.username
//                     ,id:uuid.createUUID()
//                     ,email:userentity.email
//                     ,password:userentity.password
//                 }
//             }
//             user.create(newUser, function(error,doc){
//                 if(error) {
//                     logger.error('create user error:'+error);
//                     callback(responseutil.createResult(300,'create user error'));
//
//                 } else {
//                     logger.info('create user success ,uuid : '+doc.mine.id);
//                     callback(responseutil.createResult(200,doc));
//
//                 }
//             });
//         }
//     })
// }


// function login(req, callback) {
//     var userentity = JSON.parse(JSON.stringify(req.body))
//
// //TODO 字段无会抛异常
//     logger.info("查询doc,email:"+userentity.email)
//     user.findOne({"mine.email":userentity.email},function(err,doc){
//         if (err){
//             logger.info('login err:'+err);
//             callback(responseutil.createResult(300,'something wrong with server'));
//         }
//
//         logger.info("查出的user doc"+doc);
//         if (doc.mine.password == userentity.password){
//             logger.info('login success');
//             doc.last_login_time = new Date();
//             doc.last_login_ip = req.ip;
//             doc.save(function (error, doc) {
//                 if (error) {
//                     logger.error("error :" + error);
//                     throw new Error('update user doc err');
//                 }
//             });
//             delete doc.mine.password;//todo pwd没删除成功
//             callback(responseutil.createResult(200,doc));
//
//         }else{
//             callback(responseutil.createResult(300,'password wrong'));
//         }
//
//     })
//
// }√

module.exports ={
    login,
    register,
    addFriend,
    deleteFriend,
    changeUserName
};