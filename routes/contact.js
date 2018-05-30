var express = require("express");
var router = express.Router();
var userService = require('../service/Userservice')
var resUtils = require('../util/webresponse')
router.route("/user/addNewFriend")
    .post(function (req,res) {
        userService.addFriend(req).then(data =>{
            res.send(resUtils.commonResponse(200,'add friend success',data));
        }).catch(err =>{
            res.send(resUtils.commonResponse(300,'add friend failed', err));
        })
    });

// router.route("/user/deleteFriend")
//     .post(function (req, res) {
//         userService.deleteFriend(req).then(data =>{
//             res.send(resUtils.commonResponse(200,'delete friend success',data));
//         }).catch(err=>{
//             res.send(resUtils.commonResponse(300,'delete friend failed',err));
//         })
//     })
module.exports = router;
