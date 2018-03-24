var logger = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;
var responseutil = require('../util/webresponse');
var uuid = require("../util/uuid")
function getArticleList(req, res) {


    var articleentity = JSON.parse(JSON.stringify(req.body));

    var iparticle = new Array();
    var userarticle = new Array();


    //todo 回调地狱
    logger.info("查询ip为:"+ req.ip + "的文章");
    article.find({"ownerid":null,"ownerip":req.ip},function (err,docs) {
        if (err){
            logger.error("ip article search err:"+err);
        }
//todo 好像查不到id为null
        if(docs.length > 0){
            logger.info('find ip article');
            docs.forEach(function (ele) {
                iparticle.push(ele);
            });
        }


        //logger.info('the result article:'+JSON.stringify(result));
        //res.send(result);
        if (articleentity.userid != undefined){
            article.find({"ownerid":articleentity.userid},function (err, docs) {
                if (err){
                    logger.error("user article search err:"+err);

                }

                if (docs.length >0){
                    logger.info('find id article');
                    docs.forEach(function (ele) {
                        userarticle.push(ele);
                    });
                }


                var data = {iparticle,userarticle};

                logger.info('the result article:'+JSON.stringify(data));
                res.send(responseutil.createResult(200,'find article success',JSON.stringify(data)));


            })
        }





    });





}

function saveArticle(req,res){
    var bodyentity = JSON.parse(JSON.stringify(req.body));

    var queryCondition = {};
    bodyentity.ownerip = req.ip;
    queryCondition.ownerip = req.ip;
    queryCondition.title = bodyentity.title;
    bodyentity.time = new Date().getTime();
    if(bodyentity.userid != undefined) {

        queryCondition.userid = bodyentity.userid;
    }

    article.find({title:{$in:bodyentity.title}},function (err, docs) {
        if (err){
            logger.error("user article search err:"+err);

        }
//todo 查找
        if (docs.length >0 && (docs[0].userid == bodyentity.ownerid ||docs[0].ownerip == req.ip)){
            logger.info('article exist');
            if (docs[0].time > bodyentity.time){
                //todo更新文章
                article.update(queryCondition,bodyentity,function (err) {
                    if (err){
                        logger.error('update article ' + bodyentity.articleid +'failed :'+err);
                        res.send(responseutil.createResult(300,'save article failed',JSON.stringify(req.body)));

                    }
                    logger.info('update article ' + bodyentity +'success');
                    logger.info('update article ' + JSON.stringify(req.body) +'success');
                    res.send(responseutil.createResult(200,'save article success',JSON.stringify(req.body)));

                })
            }
        }else{
            bodyentity.articleid = uuid.createUUID();
            article.create(bodyentity,function (err,doc) {
                if (err){
                    logger.error('save article error:'+err);
                    res.send(responseutil.createResult(300,'save article failed',JSON.stringify(req.body)));

                }
                logger.info('create article ' + doc + 'success');
                res.send(responseutil.createResult(200,'save article success',JSON.stringify(req.body)));

            })
        }




    })

    


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