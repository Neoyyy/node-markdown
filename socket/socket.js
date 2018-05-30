 var log = require("../frame/log/logger");
var userService = require('../service/Userservice');
var redisService = require('../redis/thenRedis');
var userDao = require('../dao/userDao');
 //var RedisCache = require("../redis/redis");
 var webResponse = require("../util/webresponse");
 var sockets = new Array()

 async function addNewFriend(socket, data) {
     var user = await userDao.get({"mine.email":data.userid}).catch(err =>{
         log.error("err: " + err);
         throw 'find user err';
     })
     var flag = 0;
     if (user != undefined && JSON.stringify(user).length > 0) {
         var youself = await userDao.get({"mine.email":data.myid}).catch(err =>{
             log.error("err: " + err);
             throw 'find user err';
         })
         if (youself != undefined && JSON.stringify(youself).length > 0) {
                youself.friend.forEach(function (groupItem) {
                    if (groupItem.groupname == data.groupname){
                        groupItem.list.push(user.mine);
                        flag = 1;
                    }
                })
             if (flag == 0){
                    youself.friend.push({
                        groupname:data.groupname,
                        id:youself.friend.length + 1,
                        list:[user.mine]
                    });
             }

             return userDao.update({'mine.email':youself.mine.email},youself);
         }else{
             throw 'find user err';

         }
     }else{
         throw 'find user err';

     }
 }

 async function login(socket, data) {
     var address = socket.handshake.address;
     log.info(Date()+" user " + data.email + " login from " + address);
     var user = await userService.login(data).catch(err =>{
         log.error("err :" + err);
         //socket.emit('loginResult', {code:300,errMsg:err});
         throw err;
     });

      log.info("login success")
      var old_socket = sockets[user.mine.email];
      if(old_socket && address != old_socket.handshake.address){
          old_socket.emit("logout");//todo 前端还没监听
          log.info("log out:" + old_socket.id + ",address: " + old_socket.handshake.address);//单点登陆
      }

      if(old_socket && old_socket != socket){
          old_socket.disconnect();
      }

      socket.id = user.mine.email;

      sockets[user.mine.email] = socket;
      return user;
      //log.info("send login success result")
      //socket.emit('loginResult',{code:200,userid:user.mine.id});
      //send_history_msg(socket);//获取离线消息

     //RedisCache.publish("user_login_channel",data);



 }


 function handleChat(socket, Msg) {
     log.info("typeof:" + typeof Msg);
     log.info(Msg);
     log.info(JSON.stringify(Msg))
     log.info("socket,chat to : " + Msg.to + " ,from: " + Msg.from);
     var receiveSocket = sockets[Msg.to];
     if (receiveSocket){
         log.info("对方在线: " + receiveSocket.id);
         receiveSocket.emit('chat', Msg);
     }else{
         log.info("对方不在线，存储至redis ");
         //todo sendtoHistory
         redisService.setChatHistory(Msg.to, Msg).then(hash =>{
             log.info("set chat history to redis success");
             socket.emit("sendMsgResult",{code:200,Msg:'success'});

         }).catch(err =>{
             log.error("set history to redis err, err: " + err);
             socket.emit('sendMsgResult', {code:300,Msg:err});
         });
     }
 }


 function sendHistoryMsg(socket,email){
     redisService.getChatHistory(email).then(Msg =>{
         log.info("get the history msg");
         log.info(Msg);

         socket.emit('chatHistoryMsg',Msg);

     }).catch(err =>{
        log.error("get chat history  for " + email + " err: " + err);
     });
 }
//

//
//
//
// //获取历史消息
// function send_history_msg(socket) {
//
// //todo redis获取离线消息
//
//     RedisCache.get("historyMsg", socket.userid, function (err, msg) {
//         if(msg.length > 0 ){
//             if (!socket.is_sending_msg){
//                 send_msg("historyMsg", msg);
//             }else{
//                 delay_send_msg("historyMsg",msg);
//             }
//             RedisCache.hdel("historyMsg", socket.userid,function (err, result) {
//
//             })
//         }
//
//
//     })
//
//
//
// }
//
// function delay_send_msg(event, data) {
//     setTimeout(function () {
//         send_msg(event, data);
//     },5000);//延迟5秒
// }
//
// //向其他用户发送消息
// function send_msg(event, data) {
//
//     var sendTo = data.sendto;
//     receiveSocket = sockets[sendTo];
//     if (receiveSocket && receiveSocket.status == "1"){
//         //发送消息
//
//         if (receiveSocket.is_sending_msg){
//             delay_send_msg(event, data);
//             return;
//         }else{
//             receiveSocket.is_sending_msg = true;
//             receiveSocket.emit(event,data,function (ack) {
//                 receiveSocket.is_sending_msg = false;
//                 if (!ack){
//                     delay_send_msg(event, data);
//                 }
//             });
//         }
//
//
//
//     }else{
//         //保存离线消息到redis
//         var historyList = [];
//         //todo 封装redis/cache
//         RedisCache.get("historyMsg",sendTo, function (err, value) {
//             if (value){
//                 historyList = JSON.parse(value);
//                 historyList.push(data);
//                 RedisCache.hset("historyMsg", sendTo, JSON.stringify(historyList), function (err, result) {
//
//                 })
//             }
//         })
//
//     }
//
// }
//
//

//
// function signout(socket, data) {
//     var address = socket.handshake.address;
//     logger.info(Date()+" user " + data.userid + " sign out," + address.address + ":" + address.port);
//     delete sockets[data.userid];
//     RedisCache.pubish("user_sign_out_channel",data);
//
// }
//
// function disconnect(socket, data) {
//     var address = socket.handshake.address;
//     logger.info(Date() + address.address + ":" + address.port + "disconnected");
//     signout(socket, data);
//
// }
//
//
// //更改文章权限
// function articleAuthority(data) {
//
// }
//
//
//
//
module.exports = {
    login,
    handleChat,
    sendHistoryMsg
    // ,signout,
    // disconnect,
    // sockets

}
//
//
// /**
//  *
//  * article_json:{
//  * articleid,
//  * authoritystatus,
//  * readable[]
//  * owner[],
//  * changeable:
//  * changeablelist[],
//  * unchangeablelist[]
//  *
//  *
//  * }
//  *
//  *
//  *
//  * login_json:{
//  *
//  *userid
//  * password
//  *deviceid,
//  * sendto
//  *
//  * }
//  *
//  * message_json:{
//  * fromid,
//  * data,
//  * sendto
//  * }
//  *
//  *
//  * historyMsg:{
//  * [message_json]
//  *
//  * }
//  *
//  *socket:{
//  * userid,
//  * deviceid,
//  * is_sending_msg, 1 true,2 false
//  *
//  * }
//  *
//  **/