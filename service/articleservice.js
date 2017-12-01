var logger = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;
var responseutil = require('../util/webresponse');
var counter = require('../mongodb/counter');

function getArticleList(req, res) {


    var articleentity = JSON.parse(JSON.stringify(req.body));
    var query = {};

    article.find({"$or":[{"owneremail":articleentity.email},{"ownerip":req.ip}]},function (err,docs) {
        if (err){
            logger.error("article search err:"+err);
        }
        logger.info('find???');
        var result = [];

        docs.forEach(function (ele) {
            resultArticle = {};
            resultArticle.articleid = ele.articleid;
            resultArticle.title = ele.title;
            resultArticle.owneremail = ele.owneremail;
            resultArticle.time = ele.time;
            result.push(resultArticle);
        });

        logger.info('the result article:'+JSON.stringify(result));
        res.send(result);
    })

}


function createArticle(req, callback) {
    var articleentity = JSON.parse(JSON.stringify(req.body));
    //todo articleid改为自增
    article.create({articleid:articleentity.articleid,
                    title:articleentity.title,
                    ownerip:req.ip,
                    owneremail:articleentity.owneremail,
                    content:articleentity.content,
                    time:new Date()},function (err,doc) {
        if (err){
            logger.error('create article error:'+err);
        }
        logger.info('create article ' + doc + 'success');
    })

}

function deleteArticle(req, callback) {
    var articleid = req.params.articleid;
    article.remove({articleid:articleid},function (err) {
        if (err){
            logger.error('delete article ' + articleid +'failed :'+err);
        }
        logger.info('delete article ' + articleid +' success');
    })
}

function updateArticle(req, callback) {
    var articleentity = JSON.parse(JSON.stringify(req.body));
    article.update({articleid:articleentity.articleid},articleentity,function (err) {
        if (err){
            logger.error('update article ' + articleentity.articleid +'failed :'+err);
        }
        logger.info('update article ' + articleentity +'success');
        logger.info('update article ' + JSON.stringify(req.body) +'success');


    })

}

function exportAs(req, res) {
    
}



module.exports ={
    getArticleList,
    createArticle,
    deleteArticle,
    updateArticle
}