var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var loginService = require('../service/userservice');

router.route('/login').post(function (req,res) {

    var data = JSON.parse(JSON.stringify(req.body))

    logger.info('post data:'+data);




    loginService.login(data,function (loginResult) {
        if (loginResult.code == 200){
            res.send(loginResult.message);
        }else{
            res.send(loginResult.message);
        }
    })


})


module.exports = router;