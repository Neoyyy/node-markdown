var log = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;
var responseutil = require('../util/webresponse');
var uuid = require("../util/uuid")
var articleDao = require("../dao/articleDao")


async function getArticles(req) {
    var ipArticles = null;
    var ownerArticles = null;
    var errorMsg = new Array();
    log.info("type of req body:"+typeof req.body)
    var reqEntity = JSON.parse(JSON.parse(req.body));
    log.info("get articles,req body:" + reqEntity);
    if (reqEntity.owneremail != undefined){
        log.info("query for " + reqEntity.owneremail + "'s articles");
        ownerArticles = await articleDao.getDocs({owneremail:reqEntity.owneremail}).catch(err =>{
            log.error("get " + reqEntity.owneremail + " failed:" + err);
            errorMsg.push('get owneremail article failed');
        });
    }
    ipArticles = await articleDao.getDocs({ownerip:req.ip, owneremail:{ $exists: false}}).catch(err =>{
        log.error("get " + req.ip + " failed:" + err);
        errorMsg.push('get  host article failed');
    });

    if (errorMsg.length < 2){
        return {ipArticles,ownerArticles};
    }else{
        log.error("get article failed, don't get any articles");
        throw 'don\'t get any articles';
    }

}

async function getShareArticle(req) {
    var reqEntity = JSON.parse(JSON.stringify(req.body));
    log.info("get share article, article id: " + reqEntity.articleid);
    var article = await articleDao.getOne({articleid:reqEntity.articleid}).catch(err =>{
        log.error("get share article failed, err: " + err);
        throw 'get share article failed';
    })
    if (article.owneremail != undefined){
        if (article.owneremail == reqEntity.email){
            return article;
        }else{
            switch (article.authtype){
                case 7:
                    if (article.userlist.indexOf(reqEntity.email) != -1){
                        log.error("unable to get share article, cant read, type: 7");
                        throw 'unable to read'
                    }else{
                        return article;
                    }
                    break;
                case 3:
                    if (article.userlist.indexOf(reqEntity.email) != -1){
                        return article;
                    }else{
                        log.error("unable to get share article, cant read, type: 3");
                        throw 'unable to read';
                    }
                    break;
                default:
                    return article;
                    break;
            }
        }
    }
}

async function insertArticle(req) {
    var reqEntity = JSON.parse(JSON.stringify(req.body));
    reqEntity.ownerip = req.ip;
    reqEntity.time = new Date();
    reqEntity.articleid = uuid.createUUID();
    return await articleDao.insert(reqEntity).catch(err =>{
        log.error("insert article failed, err: " + err);
        throw 'insert article failed';
    })
}

async function updateArticle(req) {

    var reqEntity = JSON.parse(JSON.stringify(req.body));
    var article = await articleDao.getOne({articleid:reqEntity.articleid}).catch(err =>{
        log.error("get article failed, err: " + err);
        throw 'get article failed';
    });
    if (article != undefined && JSON.stringify(article).length >0 ){
        return await articleDao.insert(reqEntity).catch(err =>{
            log.error("insert article failed, err: " + err);
            throw 'insert article failed';
        });
    }else{
        if (article.owneremail == reqEntity.owneremail){
            reqEntity.time = new Data();
            reqEntity.ownerip = req.ip;
            return await articleDao.update({articleid:reqEntity.articleid},reqEntity).catch(err =>{
                log.error("update article failed, err: " + err);
                throw 'update article failed';
            });
        }else{
            switch (article.authtype){
                case 2:
                    if (article.userlist.indexOf(reqEntity.owneremail) != -1){
                        return await articleDao.update({articleid:reqEntity.articleid}, reqEntity).catch(err =>{
                            log.error("unable to update article failed, err: " + err);
                            throw 'unable to update article';
                        })
                    }else{
                        log.error("unable to update article failed, type: 2");
                        throw 'unable to update article';
                    }
                    break;
                case 4:
                    if (article.userlist.indexOf(reqEntity.owneremail) != -1){
                        log.error("unable to update article failed, type: 4");
                        throw 'unable to update article';
                    }else{
                        return await articleDao.update({articleid:reqEntity.articleid}, reqEntity).catch(err =>{
                            log.error("unable to update article failed, err: " + err);
                            throw 'unable to update article';
                        })
                    }
                    break;
                default:
                    return await articleDao.update({articleid:reqEntity.articleid}, reqEntity).catch(err =>{
                        log.error("unable to update article failed, err: " + err);
                        throw 'unable to update article';
                    })
                    break;
            }
        }
    }

}

//6 部分用户可读    7部分用户不可读  8仅自己可读 1 所有人可读可修改 2可修改 3 部分用户可读 4 部分用户可修改

//
// function getArticleList(req, res) {
//
//
//     var articleentity = JSON.parse(JSON.stringify(req.body));
//
//     var iparticle = new Array();
//     var userarticle = new Array();
//
//
//     logger.info("查询ip为:"+ req.ip + "的文章");
//     article.find({"ownerid":null,"ownerip":req.ip},function (err,docs) {
//         if (err){
//             logger.error("ip article search err:"+err);
//         }
// //todo 好像查不到id为null
//         if(docs.length > 0){
//             logger.info('find ip article');
//             docs.forEach(function (ele) {
//                 iparticle.push(ele);
//             });
//         }
//
//
//
//         if (articleentity.id != undefined){
//             article.find({"ownerid":articleentity.id},function (err, docs) {
//                 if (err){
//                     logger.error("user article search err:"+err);
//
//                 }
//
//                 if (docs.length >0){
//                     logger.info('find id article');
//                     docs.forEach(function (ele) {
//                         userarticle.push(ele);
//                     });
//                 }
//
//
//                 var data = {iparticle,userarticle};
//
//                 logger.info('the result article:'+JSON.stringify(data));
//                 res.send(responseutil.createResult(200,'find article success',data));
//
//
//             })
//         }
//
//     });
//
//
//
//
//
// }

// function getShareArticle(req,res) {
//     var bodyentity = JSON.parse(JSON.stringify(req.body));
//     logger.info("get shared article:" + bodyentity.articleid);
//     articleDao.getOne({articleid:bodyentity.articleid}).then(function(doc){
//         if (!(JSON.stringify(doc) == 'null') && doc !== undefined ){
//             if(doc.owneremail == undefined || bodyentity.mine.email == doc.owneremail){
//                 res.send(responseutil.createResult(200,"get",doc));
//             }else{
//                 if(bodyentity.mine.email != doc.owneremail){
//                     switch (doc.permissiontype){
//                         case "2"://可读可修改
//                         res.send(responseutil.createResult(200,"get",doc));
//                         break;
//                         default:
//                             res.send(responseutil.createResult(300,"无权限删除"));
//                             break;
//                     }
//                 }
//
//             }
//         }else{
//             res.send(responseutil.createResult(300,'not find'));
//         }
//     },function (err) {
//         res.send(responseutil.createResult(300,'not find'));
//     })
// }

// function createArticle(req, res) {
//     var articleentity = JSON.parse(JSON.stringify(req.body));
//     articleentity.ownerip = req.ip;
//     articleentity.time = new Date();
//     articleDao.insert(articleentity).then(function (doc) {
//         res.send(responseutil.createResult(200,'create article success'));
//     },function (err) {
//         res.send(responseutil.createResult(300,err));
//     })
//
//
// }

// function deleteArticle(req, res) {
//     var bodyentity = JSON.parse(JSON.stringify(req.body));
//     var articleId = bodyentity.articleid;
//     //var articleid = req.params.articleid;
//     logger.info("query condition:"+articleId)
//     articleDao.getOne({"articleid":articleId}).then(function (doc) {
//         if (!(JSON.stringify(doc) == 'null') && doc !== undefined ){
//             if(doc.owneremail == undefined || bodyentity.mine.email == doc.owneremail){
//                 return articleDao.del({articleid:articleId})
//             }else{
//                 if(bodyentity.mine.email != doc.owneremail){
//                     switch (doc.permissiontype){
//                         case "6":
//                             if(doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
//                                 res.send(responseutil.createResult(200,"get",doc));
//                             }else{
//                                 res.send(responseutil.createResult(300,"无权限读"));
//                             }
//                             break;
//                         case "7":
//                             if(doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
//                                 res.send(responseutil.createResult(300,"无权限读"));
//                             }else{
//                                 res.send(responseutil.createResult(200,"get",doc));
//                             }
//                             break;
//                         case "8":
//                             res.send(responseutil.createResult(300,"无权限读"));
//                             break;
//
//                         default:
//                             res.send(responseutil.createResult(200,"get",doc));
//                             break;
//                     }
//                 }
//
//             }
//         }else{
//             logger.info("article not exist")
//             res.send(responseutil.createResult(300,'article not exist'))
//         }
//     },function (err) {
//         logger.error(err)
//         res.send(responseutil.createResult(300,err));
//     }).then(function (doc) {
//         logger.info("delete success")
//         res.send(responseutil.createResult(200,'delete success',doc));
//     },function (err) {
//         logger.error(err)
//         res.send(responseutil.createResult(300,err));
//     })
//
//
// }




//6 部分用户可读    7部分用户不可读  8仅自己可读

//
// function updateArticle(req, res) {
//     var articleentity = JSON.parse(JSON.stringify(req.body));
//
//     if(articleentity.articleid == undefined){
//
//             //保存文章
//             logger.info("article id not exist,save article");
//             articleentity.articleid = uuid.createUUID();
//         articleDao.insert(articleentity).then(function (doc) {
//             logger.info("save article success");
//             res.send(responseutil.createResult(200,"保存成功"));
//         },function (err) {
//             logger.info("update article failed");
//             res.send(responseutil.createResult(300,err));
//         })
//
//
//     }
//
//     articleDao.getOne({articleid:articleentity.articleid}).then(function (doc) {
//         logger.info("get the article:" + doc)
//         logger.info("string doc:" + JSON.stringify(doc))
//         if (!(JSON.stringify(doc) == 'null') && doc !== undefined ){
//             logger.info("article exist")
//
//             if(doc.length > 0){
//             doc.title = articleentity.title;
//             doc.content = articleentity.content;
//             doc.time = new Date();
//             if (doc.owneremail == undefined){
//                 doc.ownerip = req.ip;
//                 if (articleentity.email !== undefined){
//                     doc.owneremail = articleentity.email;
//                 }
//                 doc.permissiontype = articleentity.permissiontype;
//                 doc.authuserlist = articleentity.authuserlist;
//                 return articleDao.update(doc);
//             }else{
//                 if (doc.owneremail == articleentity.email){
//                     return articleDao.update(articleentity);
//                 }
//                 switch (doc.permissiontype){
//                     case "1"://所有人仅可读
//                         res.send(responseutil.createResult(300,"仅可读"));
//                         break;
//                     case "2"://可读可修改
//                         return articleDao.update(doc);
//                         break;
//                     case "3"://部分用户可读
//                         res.send(responseutil.createResult(300,"仅可读"));
//                         break;
//                     case "4"://部分用户可修改
//                         if(doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
//                             return articleDao.update(doc);
//                         }else{
//                             res.send(responseutil.createResult(300,"无权限修改"));
//                         }
//                         break;
//                     case "5"://部分用户不可修改
//                         if (doc.authuserlist.indexOf({userid:articleentity.mine.id}) != -1){
//                             return articleDao.update(doc);
//                         }else{
//                             res.send(responseutil.createResult(300,"无权限修改"));
//                         }
//                         break;
//                 }
//             }
//         }
//         }else{
//             //保存文章
//             logger.info("no article find,save article");
//         articleDao.insert(articleentity).then(function (doc) {
//             logger.info("save article success");
//             res.send(responseutil.createResult(200,"保存成功"));
//         },function (err) {
//             logger.info("update article failed");
//             res.send(responseutil.createResult(300,err));
//         })
//         }
//     },function (err) {
//         logger.error("get article err:" + err);
//         res.send(responseutil.createResult(300,err));
//     }).then(function (doc) {
//         logger.info("update article success");
//         res.send(responseutil.createResult(200,"修改成功"));
//     },function (err) {
//         logger.error("update article failed " + err);
//         res.send(responseutil.createResult(300,err));
//     });
//
//
//
// }




//todo 是否要删除功能

module.exports ={
    getArticles,
    getShareArticle,
    insertArticle,
    updateArticle

}