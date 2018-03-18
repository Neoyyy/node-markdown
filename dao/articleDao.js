var logger = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;
var responseutil = require('../util/webresponse');

function getArticleList(email, ip) {


    var query = {};

    article.find({"$or":[{"owner_email":email},{"owner_ip":ip}]},function (err,docs) {
        if (err){
            logger.error("article search err:"+err);
        }
        logger.info('find???');
        var result = [];

        docs.forEach(function (ele) {
            resultArticle = {};
            resultArticle.articleid = ele.article_id;
            resultArticle.title = ele.title;
            resultArticle.owneremail = ele.owner_email;
            resultArticle.time = ele.time;
            result.push(resultArticle);
        });

        logger.info('the result article:'+JSON.stringify(result));

    })
    return result;
}

function saveArticle(req,res){
    var article = JSON.parse(JSON.stringify(req.body));
}


function createArticle(req, callback) {
    var articleentity = JSON.parse(JSON.stringify(req.body));
    //todo articleid改为自增
    article.create({article_id:articleentity.articleid,
        title:articleentity.title,
        owner_ip:req.ip,
        owner_email:articleentity.owneremail,
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
    article.remove({article_id:articleid},function (err) {
        if (err){
            logger.error('delete article ' + articleid +'failed :'+err);
        }
        logger.info('delete article ' + articleid +' success');
    })
}

function updateArticle(req, callback) {
    var articleentity = JSON.parse(JSON.stringify(req.body));
    article.update({article_id:articleentity.articleid},articleentity,function (err) {
        if (err){
            logger.error('update article ' + articleentity.articleid +'failed :'+err);
        }
        logger.info('update article ' + articleentity +'success');
        logger.info('update article ' + JSON.stringify(req.body) +'success');


    })

}

function getArticle(articleId){
    article.find({article_id:articleId},function (err,docs) {

    })
    return docs;
}

function getShareCode(req, res){

    var articleentity = JSON.parse(JSON.stringify(req.body));

}


function exportAs(req, res) {

}



module.exports ={
    getArticleList,
    createArticle,
    deleteArticle,
    saveArticle,
    updateArticle
}