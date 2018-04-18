var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var Articleservice = require('../service/Articleservice');


router.route("/article/getArticleList")
    .post(function (req,res) {
        logger.info('getarticles post data:'+JSON.stringify(req.body));
        Articleservice.getArticleList(req,res);
    });
//
// //TODO 测试
// router.route("/article/save")
//     .post(function(req,res){
//         logger.info('save article,content:'+JSON.stringify(req.body));
//         Articleservice.saveArticle(req,res);
//     })

router.route("/article/saveArticle")
    .post(function (req,res) {
        logger.info('create article post data:'+JSON.stringify(req.body));
        Articleservice.updateArticle(req,res);
    });

router.route('/article/updateArticle')
    .post(function (req,res) {
        logger.info('update article post data:'+JSON.stringify(req.body));
        Articleservice.updateArticle(req,res);


    });

router.route('/article/share/:articleId')
    .get(function (req,res) {
    var articleid = req.params.articleId;

    });

router.route('/article/getArticleById')
    .post(function(req,res){
        Articleservice.getArticleById(req,res);
    });


router.route('/article/getsharearticle')
    .post(function (req,res) {
        Articleservice.getShareArticle(req,res);
    });

router.route('/article/delete')
    .post(function (req,res) {
        logger.info('delete article start');
        Articleservice.deleteArticle(req,res);
    });



module.exports = router;