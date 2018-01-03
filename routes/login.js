var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var loginService = require('../service/Userservice');

router.route('/login').post(function (req,res) {
    logger.info('register post data:'+JSON.stringify(req.body));
    loginService.login(req,function (loginResult) {
            res.send(loginResult.message);
    })


});



router.route('/register').post(function (req,res) {

    logger.info('login post data:'+JSON.stringify(req.body));
    loginService.register(req,function (loginResult) {
            res.send(loginResult.message);
    })


});


module.exports = router;