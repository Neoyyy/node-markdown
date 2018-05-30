var log = require('../frame/log/logger');
var article = require('../mongodb/article').articleModel;
var responseutil = require('../util/webresponse');
var uuid = require("../util/uuid")
var articleDao = require("../dao/articleDao")
var fs = require('fs');
var markdownpdf= require('markdown-pdf')
// 4部分用户不可读
// 5仅自己可读
//6部分用户不可修改
// 1 所有人可读可修改
// 2 部分用户仅可读
// 3 部分用户可修改
async function getArticleById(req) {
    var reqEntity = req.body;
    log.info("find article by :" + reqEntity.articleid);
    var article = await articleDao.getOne({articleid:reqEntity.articleid}).catch(err =>{
        log.error("find article by id failed:" + err);
        throw 'get article failed';
    });
    if (article && JSON.stringify(article).length> 2){
        if (reqEntity.editemail != null && reqEntity.editemail != ''){

            switch (article.authtype){
                case '4':
                    if (article.userlist.indexOf(reqEntity.editemail) != -1){
                        throw 'unable to get';
                    }else{
                        return article;
                    }
                    break;
                case '5':
                    if (article.owneremail != reqEntity.editemail){
                        throw 'unable to get,not owner';
                    }else{
                        return article;
                    }
                    break;
                default:
                    return article;
                    break
            }
        }else{

            switch (article.authtype){

                case '4':
                    throw 'unable to get,not login';
                    break;
                case '5':
                    throw 'unable to get,not owner';
                    break;
                default:
                    return article;
                    break;

            }
        }

    }else{
        throw 'article not exist';
    }
}


//todo 测试
async function deleteArticle(req) {
    var reqEntity = req.body;
    log.info("the article will delete: " + JSON.stringify(reqEntity));
    if (reqEntity.articleid == null || !reqEntity.articleid){
        log.error("before delete ,article not exist")
        throw 'article not exist';
    }else{
        log.info("before delete ,find article,statement: " + JSON.stringify({articleid:reqEntity.articleid}))
        var article = await articleDao.getOne({articleid:reqEntity.articleid}).catch(err=>{
            log.error("before delete, get article failed, err: " + err);
            throw err;
        });
        if (article && article.articleid){

            if (!article.owneremail){
                var a = await articleDao.del({articleid:reqEntity.articleid}).catch(err=>{
                    log.error("while delete err: " + err);
                    throw 'delete failed';
                })
                return a;
            }else{
                if (article.owneremail == article.editemail){
                    var a = await articleDao.del({articleid:reqEntity.articleid}).catch(err=>{
                        log.error("while delete err: " + err);
                        throw 'delete failed';
                    })
                    return a;
                }else{

                    log.error("not owner")
                    throw 'not owner';
                }
                // switch (article.authtype){
                //     case 3:
                //         if (article.userlist.indexOf(reqEntity.editemail) != -1) {
                //             var a = await articleDao.del({articleid:reqEntity.articleid}).catch(err=>{
                //                 log.error("while delete err: " + err);
                //             })
                //             return a;
                //         }else{
                //             log.error("unable to delete");
                //             throw 'unable to delete'
                //         }
                //             break;
                //     case 1:
                //         var a = await articleDao.del({articleid:reqEntity.articleid}).catch(err=>{
                //             log.error("while delete err: " + err);
                //         })
                //         return a;
                //         break;
                //     case 6:
                //         if (article.userlist.indexOf(reqEntity.editemail) != -1) {
                //             log.error("unable to delete");
                //             throw 'unable to delete'
                //         }else{
                //             var a = await articleDao.del({articleid:reqEntity.articleid}).catch(err=>{
                //                 log.error("while delete err: " + err);
                //             })
                //             return a;
                //         }
                //         break;
                //     default:
                //         throw 'unable to delete';
                //         break;
                // }
            }

        }else{
            log.error("before delete ,article not exist")
            throw 'article not exist';

        }
    }
}

async function getArticles(req) {
    var ipArticles = null;
    var ownerArticles = null;
    var errorMsg = new Array();
    var reqEntity = req.body;
    log.info("get articles,req body:" + JSON.stringify(reqEntity));
    if (reqEntity.email != undefined){
        log.info("query for " + reqEntity.email + "'s articles");
        ownerArticles = await articleDao.getDocs({owneremail:reqEntity.email}).catch(err =>{
            log.error("get " + reqEntity.email + " failed:" + err);
            errorMsg.push('get owneremail article failed');
        });
    }
    ipArticles = await articleDao.getDocs({ownerip:req.ip, owneremail:""}).catch(err =>{
        log.error("get " + req.ip + " failed:" + err);
        errorMsg.push('get  host article failed');
    });

    if (errorMsg.length < 2){
        var result = {};
        if (ipArticles != null){
            result.ipArticles = ipArticles;
        }
        if (ownerArticles != null){
            result.ownerArticles = ownerArticles;
        }
        return result;
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
                case 4:
                    if (article.userlist.indexOf(reqEntity.email) != -1){
                        log.error("unable to get share article, cant read, type: 7");
                        throw 'unable to read'
                    }else{
                        return article;
                    }
                    break;
                case 2:
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

async function saveAsPDF(req) {
    var reqEntity = req.body;
    log.info("service save as pdf");
    return new Promise(function (resolve, reject) {
        var fileName = uuid.createUUID();
        fs.writeFile(process.cwd() + '/public/temp/' + fileName + '.md', reqEntity.content, {flag: 'a'}, function (err) {
            if(err) {
                reject(err);
            } else {

                var readStream = fs.createReadStream(process.cwd() + '/public/temp/' + fileName + '.md');
                var writeStream = fs.createWriteStream(process.cwd() + '/public/temp/' + fileName + '.pdf');
                    readStream.pipe(markdownpdf())
                    .pipe(writeStream)
                writeStream.on('close', function () {
                    resolve(fileName);

                });



                readStream.on('end',function () {

                })
            }
        });
    })



}


async function updateArticle(req) {

    var reqEntity = req.body;
    log.info("the article::::" + JSON.stringify(reqEntity))
    // var list = [];
    // reqEntity.userlist.forEach(function (item) {
    //     list.push({
    //         userid:item
    //     })
    // })
    var updateStatment = {
        $set:{
            title:reqEntity.title,
            ownerip:req.ip,
            owneremail:reqEntity.owneremail,
            content:reqEntity.content,
            time:new Date(),
            authtype:reqEntity.authtype,
            userlist:reqEntity.userlist

        }
    }
    if (reqEntity.articleid == null || reqEntity.articleid.length <= 0){
        reqEntity.articleid = uuid.createUUID();
        //作为新的文章插入
        log.info("no owner article,save as ipArticle");
        reqEntity.ownerip = req.ip;
        delete reqEntity._id;

        return await articleDao.insert(reqEntity).catch(err =>{
            log.error("save as ipArticle failed, err: " + err);
            throw err;
        })
    }else{
        //查询已有的文章做对比
        var article = await articleDao.getOne({articleid:reqEntity.articleid}).catch(err =>{
            log.error("get article failed, err: " + err);
            throw 'get article failed';
        });

        article = article._doc
        if (reqEntity.isUpdate){
            //修改他人
            if (article.authtype){

                switch (article.authtype){
                    case '2':
                            log.error("3 unable to update article failed, type: 2");
                            throw 'unable to update article';
                        break;
                    case '3':
                        if (article.userlist.indexOf(reqEntity.editemail) != -1) {
                            return await articleDao.update({articleid:reqEntity.articleid}, updateStatment).catch(err =>{
                                log.error("3 unable to update article failed, err: " + err);
                                throw 'unable to update article';
                            })
                        }else{

                            log.error("3 unable to update article failed, type: 3");
                            throw 'unable to update article';
                        }
                        break;
                    case '6':
                        if (article.userlist.indexOf(reqEntity.editemail) != -1) {
                            log.error("6 unable to update article failed, type: 6");
                            throw 'unable to update article';
                        }else{
                            return await articleDao.update({articleid:reqEntity.articleid}, updateStatment).catch(err =>{
                                log.error("6 unable to update article failed, err: " + err);
                                throw 'unable to update article';
                            })

                        }
                        break;
                    default:
                        return await articleDao.update({articleid:reqEntity.articleid}, updateStatment).catch(err =>{
                            log.error("default unable to update article failed, err: " + err);
                            throw 'unable to update article';
                        })
                        break;
                }
            }else{
                return await articleDao.update({articleid:reqEntity.articleid},updateStatment).catch(err =>{
                    log.error("update article failed, err: " + err);
                    throw 'update article failed';
                });
            }
        }else{
            //保存为自己
            reqEntity.articleid = uuid.createUUID();
            reqEntity.ownerip = req.ip;
            delete reqEntity._id;
            return await articleDao.insert(reqEntity).catch(err =>{
                log.error("save as ipArticle failed, err: " + err);
                throw err;
            })
        }


    }






}

// 4部分用户不可读
// 5仅自己可读
//6部分用户不可修改
// 1 所有人可读可修改
// 2 部分用户仅可读
// 3 部分用户可修改



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
    updateArticle,
    deleteArticle,
    getArticleById,
    saveAsPDF

}