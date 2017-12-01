var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var loginService = require('../service/userservice');

router.route('/login').post(function (req,res) {

    loginService.login(req,function (loginResult) {
            res.send(loginResult.message);
    })


});



router.route('/register').post(function (req,res) {

    loginService.register(req,function (loginResult) {
            res.send(loginResult.message);
    })


});


module.exports = router;