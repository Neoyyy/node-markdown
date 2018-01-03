var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var Articleservice = require('../service/Articleservice');


router.route("/article/getArticleList")
    .post(function (req,res) {
        logger.info('getarticles post data:'+JSON.stringify(req.body));
        Articleservice.getArticleList(req,res);
    });

//TODO 测试
router.route("/article/save")
    .post(function(req,res){
        logger.info('save article,content:'+JSON.stringify(req.body));
        logger.info('author:');
        Articleservice.saveArticle(req,res);
    })

router.route("/article/createArticle")
    .post(function (req,res) {
        logger.info('create article post data:'+JSON.stringify(req.body));
        Articleservice.createArticle(req,function (err) {
            
        });
    });

router.route('/article/update/:articleid')
    .post(function (req,res) {
        logger.info('update article id:'+JSON.parse(JSON.stringify(req.body)).articleid);
        Articleservice.updateArticle(req,function (callback) {

        })

    });

router.route('/article/share/:articleId')
    .get(function (req,res) {
    var articleid = req.params.articleId;

    });

router.route('/article/getsharearticle/:articleId')
    .get(function (req,res) {

    });

router.route('article/delete/:articleId')
    .get(function (req,res) {

    });



module.exports = router;