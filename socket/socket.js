var logger = require("../frame/log/logger");
var Cache = require("../redis/cache");


var sockets = {}
var publicCache = Cache.prototype.newCache;
var historyCache = Cache.prototype.newCache;


//获取历史消息
function send_history_msg(socket) {

//todo redis获取离线消息

    historyCache.hget("historyMsg", socket.userid, function (err, msg) {
        if (!socket.is_sending_msg){
            send_msg("historyMsg", msg);
        }else{
            delay_send_msg("historyMsg",msg);
        }
        historyCache.hdel("historyMsg", socket.userid,function (err, result) {
            
        })
    })



}

function delay_send_msg(event, data) {
    setTimeout(function () {
        send_msg(event, data);
    },5000);//延迟5秒
}

//向其他用户发送消息
function send_msg(event, data) {

    var sendTo = data.sendto;
    receiveSocket = sockets[sendTo];
    if (receiveSocket && receiveSocket.status == "1"){
        //发送消息

        if (receiveSocket.is_sending_msg){
            delay_send_msg(event, data);
            return;
        }else{
            receiveSocket.is_sending_msg = true;
            receiveSocket.emit(event,data,function (ack) {
                receiveSocket.is_sending_msg = false;
                if (!ack){
                    delay_send_msg(event, data);
                }
            });
        }



    }else{
        //保存离线消息到redis
        var historyList = [];
        //todo 封装redis/cache
        historyCache.hget("historyMsg",sendTo, function (err, value) {
            if (value){
                historyList = JSON.parse(value);
                historyList.push(data);
                historyCache.hset("historyMsg", sendTo, JSON.stringify(historyList), function (err, result) {

                })
            }
        })

    }

}


function login(socket, data) {
    var address = socket.handshake.address;
    logger.info(Date()+" user " + data.userid + " login from" + address.address + ":" + address.port);
    var old_socket = sockets[data.userid];
    if(old_socket && data.deviceid != old_socket.deviceid){
        old_socket.emit("signout");
        logger.info("sign out:" + old_socket.userid + ",deviceid: " + old_socket.deviceid);//单点登陆
    }

    if(old_socket && old_socket != socket){
        old_socket.disconnect();
    }

    socket.userid = data.userid;
    socket.deviceid = data.userid;

    sockets[userid] = socket;

    send_history_msg(socket);//获取离线消息

    publicCache.publish("user_login_channel",data);



}

function signout(socket, data) {
    var address = socket.handshake.address;
    logger.info(Date()+" user " + data.userid + " sign out," + address.address + ":" + address.port);
    delete sockets[data.userid];
    publicCache.pubish("user_sign_out_channel",data);

}

function disconnect(socket, data) {
    var address = socket.handshake.address;
    logger.info(Date() + address.address + ":" + address.port + "disconnected");
    signout(socket, data);

}


//更改文章权限
function articleAuthority(data) {

}




module.exports = {
    login,
    signout,
    disconnect,
    sockets

}


/**
 *
 * article_json:{
 * articleid,
 * authoritystatus,
 * readable[]
 * owner[],
 * changeable:
 * changeablelist[],
 * unchangeablelist[]
 *
 *
 * }
 *
 *
 *
 * login_json:{
 *
 *userid
 * password
 *deviceid,
 * sendto
 *
 * }
 *
 * message_json:{
 * fromid,
 * data,
 * sendto
 * }
 *
 *
 * historyMsg:{
 * [message_json]
 *
 * }
 *
 *socket:{
 * userid,
 * deviceid,
 * is_sending_msg, 1 true,2 false
 *
 * }
 *
 **/