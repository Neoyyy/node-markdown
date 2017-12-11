var express = require("express");
var router = express.Router();
var logger = require('../frame/log/logger');
var articleservice = require('../service/articleservice');


router.route("/article/getarticles")
    .post(function (req,res) {
        logger.info('getarticles post data:'+JSON.stringify(req.body));
        articleservice.getArticleList(req,res);
    });


router.route("/article/createarticle")
    .post(function (req,res) {
        logger.info('create article post data:'+JSON.stringify(req.body));
        articleservice.createArticle(req,function (err) {
            
        });
    });

router.route('/article/update/:articleid')
    .post(function (req,res) {
        logger.info('update article id:'+JSON.parse(JSON.stringify(req.body)).articleid);
        articleservice.updateArticle(req,function (callback) {

        })

    });

router.route('/article/share/:articleid')
    .get(function (req,res) {
    var articleid = req.params.articleid;

    });

router.route('/article/getsharearticle/:articleid')
    .get(function (req,res) {

    });

router.route('article/delete/:articleid')
    .get(function (req,res) {

    });



module.exports = router;