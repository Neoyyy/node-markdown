var logger = require("../frame/log/logger");
var RedisCache = require("../redis/cache");
var webResponse = require("../util/webresponse")

var sockets = new Array()



//获取历史消息
function send_history_msg(socket) {

//todo redis获取离线消息

    RedisCache.get("historyMsg", socket.userid, function (err, msg) {
        if(msg.length > 0 ){
            if (!socket.is_sending_msg){
                send_msg("historyMsg", msg);
            }else{
                delay_send_msg("historyMsg",msg);
            }
            RedisCache.hdel("historyMsg", socket.userid,function (err, result) {

            })
        }


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
        RedisCache.get("historyMsg",sendTo, function (err, value) {
            if (value){
                historyList = JSON.parse(value);
                historyList.push(data);
                RedisCache.hset("historyMsg", sendTo, JSON.stringify(historyList), function (err, result) {

                })
            }
        })

    }

}


function login(socket, data) {
    var address = socket.handshake.address;
    logger.info(Date()+" user " + data.userid + " login from " + address);
    var old_socket = sockets[data.id];
    if(old_socket && address != old_socket.handshake.address){
        old_socket.emit("signout");
        logger.info("sign out:" + old_socket.userid + ",address: " + old_socket.handshake.address);//单点登陆
    }

    if(old_socket && old_socket != socket){
        old_socket.disconnect();
    }

    socket.userid = data.userid;

    sockets[data.userid] = socket;

    console.log("send login success result")
    socket.emit('loginResult',webResponse.createResult(200,"login Success"));
    send_history_msg(socket);//获取离线消息

    //RedisCache.publish("user_login_channel",data);



}

function signout(socket, data) {
    var address = socket.handshake.address;
    logger.info(Date()+" user " + data.userid + " sign out," + address.address + ":" + address.port);
    delete sockets[data.userid];
    RedisCache.pubish("user_sign_out_channel",data);

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