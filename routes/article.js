var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var articleservice = require('../service/articleservice');


router.route("/getarticles")
    .post(function (req,res) {
        logger.info('getarticles post data:'+JSON.stringify(req.body));
        articleservice.getArticleList(req,res);
    });


router.route("/createarticle")
    .post(function (req,res) {
        logger.info('create article post data:'+JSON.stringify(req.body));
        articleservice.createArticle(req,function (err) {
            
        });
    });

router.route('/update')
    .post(function (req,res) {
        logger.info('update article id:'+JSON.parse(JSON.stringify(req.body)).articleid);
        articleservice.updateArticle(req,function (callback) {

        })

    })




module.exports = router;