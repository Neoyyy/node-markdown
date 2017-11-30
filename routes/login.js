var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var loginService = require('../service/userservice');

router.route('/login').post(function (req,res) {
    //console.log('data'+JSON.parse(req.body));
    var data = JSON.parse(req.params("data"))
    //var data = req.body;
    //logger.info('login data:'+data);
    console.log('post data:'+data);
    //console.log('post data:'+data);

    //res.send(req.body)
    /*
    loginService.login(data,function (loginResult) {
        if (loginResult.code == 200){
            res.send(loginResult.message);
        }else{
            res.send(loginResult.message);
        }
    })
    */

})


module.exports = router;