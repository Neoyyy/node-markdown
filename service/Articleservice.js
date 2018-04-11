var logger = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;
var responseutil = require('../util/webresponse');
var uuid = require("../util/uuid")
var articleDao = require("../dao/articleDao")
function getArticleList(req, res) {


    var articleentity = JSON.parse(JSON.stringify(req.body));

    var iparticle = new Array();
    var userarticle = new Array();


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



        if (articleentity.id != undefined){
            article.find({"ownerid":articleentity.id},function (err, docs) {
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
                res.send(responseutil.createResult(200,'find article success',data));


            })
        }





    });





}

function getShareArticle(req,res) {
    var bodyentity = JSON.parse(JSON.stringify(req.body));
    var querycondition = {};

}

// function saveArticle(req,res){
//     var bodyentity = JSON.parse(JSON.stringify(req.body));
//     logger.info("save article start");
//     articleDao.get({articleid:bodyentity.articleid}).then(function (doc) {
//         if (doc.length > 0){
//
//         }
//     },function (err) {
//         logger.error("find article " + bodyentity.articleid + "failed, err:" + err);
//         res.send(responseutil.createResult(300,err));
//     })
//
//
//
//
//
//     article.find({title:{$in:bodyentity.title}},function (err, docs) {
//         if (err){
//             logger.error("user article search err:"+err);
//
//         }
// //todo 查找
//         if (docs.length >0 && (docs[0].userid == bodyentity.ownerid ||docs[0].ownerip == req.ip)){
//             logger.info('article exist');
//             if (docs[0].time > bodyentity.time){
//                 //todo更新文章
//                 article.update(queryCondition,bodyentity,function (err) {
//                     if (err){
//                         logger.error('update article ' + bodyentity.articleid +'failed :'+err);
//                         res.send(responseutil.createResult(300,'save article failed',JSON.stringify(req.body)));
//
//                     }
//                     logger.info('update article ' + bodyentity +'success');
//                     logger.info('update article ' + JSON.stringify(req.body) +'success');
//                     res.send(responseutil.createResult(200,'save article success',JSON.stringify(req.body)));
//
//                 })
//             }
//         }else{
//             bodyentity.articleid = uuid.createUUID();
//             article.create(bodyentity,function (err,doc) {
//                 if (err){
//                     logger.error('save article error:'+err);
//                     res.send(responseutil.createResult(300,'save article failed',JSON.stringify(req.body)));
//
//                 }
//                 logger.info('create article ' + doc + 'success');
//                 res.send(responseutil.createResult(200,'save article success',JSON.stringify(req.body)));
//
//             })
//         }
//
//
//
//
//     })
//
//
//
//
// }


function createArticle(req, res) {
    var articleentity = JSON.parse(JSON.stringify(req.body));
    articleentity.ownerip = req.ip;
    articleentity.time = new Date();
    articleDao.insert(articleentity).then(function (doc) {
        res.send(responseutil.createResult(200,'create article success'));
    },function (err) {
        res.send(responseutil.createResult(300,err));
    })


}

function deleteArticle(req, res) {
    var bodyentity = JSON.parse(JSON.stringify(req.body));
    var articleId = bodyentity.articleid;
    //var articleid = req.params.articleid;
    logger.info("query condition:"+articleId)
    articleDao.get({"articleid":articleId}).then(function (doc) {
        if (!(JSON.stringify(doc) == 'null') && doc !== undefined ){
            if(doc.owneremail == undefined || bodyentity.mine.email == doc.owneremail){
                return articleDao.del({articleid:articleId})
            }else{
                if(bodyentity.mine.email != doc.owneremail){
                    switch (doc.permissiontype){
                        case "2"://可读可修改
                            return articleDao.del(doc);
                            break;
                        case "4"://部分用户可修改
                            if(doc.authuserlist.indexOf({userid:bodyentity.mine.id}) != -1){
                                return articleDao.del(doc);
                            }else{
                                res.send(responseutil.createResult(300,"无权限删除"));
                            }
                            break;
                        case "5"://部分用户不可修改
                            if (doc.authuserlist.indexOf({userid:bodyentity.mine.id}) != -1){
                                return articleDao.update(doc);
                            }else{
                                res.send(responseutil.createResult(300,"无权限删除"));
                            }
                            break;
                        default:
                            res.send(responseutil.createResult(300,"无权限删除"));
                            break;
                    }
                }

            }
        }else{
            logger.info("article not exist")
            res.send(responseutil.createResult(300,'article not exist'))
        }
    },function (err) {
        logger.error(err)
        res.send(responseutil.createResult(300,err));
    }).then(function (doc) {
        logger.info("delete success")
        res.send(responseutil.createResult(200,'delete success',doc));
    },function (err) {
        logger.error(err)
        res.send(responseutil.createResult(300,err));
    })


}

function updateArticle(req, res) {
    var articleentity = JSON.parse(JSON.stringify(req.body));

    if(articleentity.articleid == undefined){

            //保存文章
            logger.info("article id not exist,save article");
            articleentity.articleid = uuid.createUUID();
        articleDao.insert(articleentity).then(function (doc) {
            logger.info("save article success");
            res.send(responseutil.createResult(200,"保存成功"));
        },function (err) {
            logger.info("update article failed");
            res.send(responseutil.createResult(300,err));
        })


    }



    
    articleDao.get({articleid:articleentity.articleid}).then(function (doc) {
        logger.info("get the article:" + doc)
        logger.info("string doc:" + JSON.stringify(doc))
        if (!(JSON.stringify(doc) == 'null') && doc !== undefined ){
            logger.info("article exist")

            if(doc.length > 0){
            doc.title = articleentity.title;
            doc.content = articleentity.content;
            doc.time = new Date();
            if (doc.owneremail == undefined){
                doc.ownerip = req.ip;
                if (articleentity.email !== undefined){
                    doc.owneremail = articleentity.email;
                }
                doc.permissiontype = articleentity.permissiontype;
                doc.authuserlist = articleentity.authuserlist;
                return articleDao.update(doc);
            }else{
                if (doc.owneremail == articleentity.email){
                    return articleDao.update(articleentity);
                }
                switch (doc.permissiontype){
                    case "1"://所有人仅可读
                        res.send(responseutil.createResult(300,"仅可读"));
                        break;
                    case "2"://可读可修改
                        return articleDao.update(doc);
                        break;
                    case "3"://部分用户可读
                        res.send(responseutil.createResult(300,"仅可读"));
                        break;
                    case "4"://部分用户可修改
                        if(doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
                            return articleDao.update(doc);
                        }else{
                            res.send(responseutil.createResult(300,"无权限修改"));
                        }
                        break;
                    case "5"://部分用户不可修改
                        if (doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
                            return articleDao.update(doc);
                        }else{
                            res.send(responseutil.createResult(300,"无权限修改"));
                        }
                        break;
                }
            }
        }
        }else{
            //保存文章
            logger.info("no article find,save article");
        articleDao.insert(articleentity).then(function (doc) {
            logger.info("save article success");
            res.send(responseutil.createResult(200,"保存成功"));
        },function (err) {
            logger.info("update article failed");
            res.send(responseutil.createResult(300,err));
        })
        }
    },function (err) {
        logger.error("get article err:" + err);
        res.send(responseutil.createResult(300,err));
    }).then(function (doc) {
        logger.info("update article success");
        res.send(responseutil.createResult(200,"修改成功"));
    },function (err) {
        logger.error("update article failed " + err);
        res.send(responseutil.createResult(300,err));
    });



}

//
// function saveArticle(req,res) {
//     var articleentity = JSON.parse(JSON.stringify(req.body));
//     articleDao.get({articleid:articleentity.articleid}).then(function (doc) {
//
//         if (doc.length > 0){
//             if (doc.owneremail !== undefined){
//                 if (doc.owneremail != articleentity.owneremail){
//                     switch (doc.permissiontype){
//                         case "1"://所有人仅可读
//                             res.send(responseutil.createResult(300,"仅可读"));
//                             break;
//                         case "2"://可读可修改
//                             return articleDao.update(doc);
//                             break;
//                         case "3"://部分用户可读
//                             res.send(responseutil.createResult(300,"仅可读"));
//                             break;
//                         case "4"://部分用户可修改
//                             if(doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
//                                 return articleDao.update(doc);
//                             }else{
//                                 res.send(responseutil.createResult(300,"无权限修改"));
//                             }
//                             break;
//                         case "5"://部分用户不可修改
//                             if (doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
//                                 return articleDao.update(doc);
//                             }else{
//                                 res.send(responseutil.createResult(300,"无权限修改"));
//                             }
//                             break;
//                     }
//
//                     logger.error("save article err:");
//                     res.send(responseutil.createResult(300,"you are not the owner"));                }
//             }
//         }
//     },function (err) {
//         logger.error("save article err:" + err);
//         res.send(responseutil.createResult(300,err));
//     })
//     articleDao.insert(articleentity).then(function (doc) {
//         logger.error("save article success");
//         res.send(responseutil.createResult(200,doc));
//     },function (err) {
//         logger.error("save article err:" + err);
//         res.send(responseutil.createResult(300,err));
//     })
// };


function getShareCode(req, res){

    var articleentity = JSON.parse(JSON.stringify(req.body));

}

function getArticleById(req,res){
    var articleentity = JSON.parse(JSON.stringify(req.body));
    logger.info("get article by :" + articleentity.articleid);
    articleDao.get({articleid:articleentity.articleid}).then(function(doc){
        if (!(JSON.stringify(doc) == 'null') && doc !== undefined ){
            logger.info("get the article :" + doc)
            switch (doc.permissiontype){
                case "3"://部分用户可读
                    res.send(responseutil.createResult(300,"仅可读"));
                    if(doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
                        res.send(responseutil.createResult(200,"获取文章成功",doc));
                    }else{
                        res.send(responseutil.createResult(300,"无权限读取"));
                    }
                    break;
                default:
                    res.send(responseutil.createResult(200,"获取文章成功",doc));
                    break;
            }

        }else{
            res.send(responseutil.createResult(300,"article not exist"));
        }
    },function(err){
        res.send(responseutil.createResult(300,err));

    })
}





module.exports ={
    getArticleList,
    createArticle,
    deleteArticle,
    updateArticle,
    getArticleById
}