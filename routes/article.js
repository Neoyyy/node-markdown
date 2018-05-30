var express = require("express");
var router = express.Router();
var log = require('../frame/log/logger');
var resUtils = require('../util/webresponse');
var Articleservice = require('../service/Articleservice');
var fs = require('fs')

router.route("/article/getArticleList")
    .post(function (req,res) {
        log.info('getarticles post data:'+JSON.stringify(req.body));
        Articleservice.getArticles(req).then(data=>{
            log.info("the articles:" + JSON.stringify(data));
            res.send(resUtils.commonResponse(200,"get articles",data));
        }).catch(err=>{
            res.send(resUtils.commonResponse(300,"get articles failed",err));
        });
    });


router.route('/article/updateArticle')
    .post(function (req,res) {
        log.info('update article post data:'+JSON.stringify(req.body));
        Articleservice.updateArticle(req).then(data =>{
            log.info("router update article success");
            log.info(JSON.stringify(data));
            res.send(resUtils.commonResponse(200,"save article success",data));
        }).catch(err =>{
            res.send(resUtils.commonResponse(300,"save article failed",err));
        });


    });

router.route('/article/saveAsPDF')
    .post(function (req, res) {
        log.info("save as pdf");
        log.info(JSON.stringify(req.body));
        Articleservice.saveAsPDF(req).then(fileName =>{
            log.info("router save article as pdf success");
            log.info("fileName:" + fileName);

            //res.download(url);
            var result = {
                fileName:fileName,
                title:req.body.title
            }


            var filePath1 =  '/Users/neoyyyy/Desktop/github/node-markdown/public/temp/'+fileName+'.pdf';
            log.info("current File :" + filePath1)
            var stt = fs.statSync(filePath1);
            log.info("size : " + stt.size)



            res.send(resUtils.commonResponse(200,"save article as pdf success",result));
        }).catch(err =>{
            res.send(resUtils.commonResponse(300,"save article as pdf failed",err));
        });
    })

router.route('/article/deleteArticle')
    .post(function (req,res) {
        log.info('delete article start');
        Articleservice.deleteArticle(req).then(data =>{
            log.info("router delete article success");
            res.send(resUtils.commonResponse(200,"delete article success",req.body));
        }).catch(err =>{
            res.send(resUtils.commonResponse(300,"delete article failed",err));
        });
    });
router.route('/article/getArticleById')
    .post(function(req,res){
        Articleservice.getArticleById(req).then(data =>{
            log.info("router get article success");
            res.send(resUtils.commonResponse(200,"get article success",data));
        }).catch(err =>{
            res.send(resUtils.commonResponse(300,"get article failed",err));
        });
    });


router.route('/article/download')
    .get(function (req, res) {
        log.info("get request")
        log.info("fileName:" + req.query.fileName)
        log.info("uuid: " + req.query.uuid);
        log.info("type: " + req.query.type)
        var filePath =  process.cwd() + '/public/temp/' + req.query.uuid + '.' + req.query.type;
        log.info("current File :" + filePath)
        var stats = fs.statSync(filePath);
        var isFile = stats.isFile();
        if(isFile){
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + encodeURI(req.query.fileName  + '.' + req.query.type),
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.end(404);
        }






    })



module.exports = router;