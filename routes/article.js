/*
 * article 文章分类处理
 */
let express = require('express');
let route = express.Router(),
    response = require('./response'),
    PostModel = require('../db/posts');

/**
 * 文章存储
 */

route.post('/store', (req, res) => {
    //todo
    // console.log(req.body)
    PostModel.storeposts(req.body).then(result => {
        response(res, result)
    })
})

/**
 * 查看所有文章
 */
route.get('/articles', (_, res) => {
        PostModel.allposts().then(result => {
            response(res, result)
        })
    })
    /**
     * 模糊查找
     */
route.post('/findsome', (req, res) => {
        PostModel.findsome(req.body).then(result => {
            response(res, result)
        })
    })
    /**
     * 发表评论
     */
route.post('/comment', (req, res) => {
    // console.log(req.body)
    PostModel.store_comment(req.body).then(result => {
        response(res, result)
    })
})

/**
 * 获取个人文章
 */
route.get('/mypost', (req, res) => {
        PostModel.person_post(req.query.account).then(result => {
            response(res, result)
        })
    })
    /**
     * 根据id查找文章
     */
route.get('/findbyid', (req, res) => {
        PostModel.findarticle_id(req.query.flag).then(result => {
            response(res, result)
        })
    })
    /**
     * 根据id更新文章
     */
route.post('/updateposts', (req, res) => {
        PostModel.updatebyid(req.body).then(result => {
            response(res, result)
        })
    })
    /**
     * 删除个人文章
     */
route.get('/delete', (req, res) => {
        PostModel.deletebyid(req.query.flag).then(result => {
            response(res, result)
        })
    })
    /**
     * 收藏文章
     */
route.post('/collect', (req, res) => {
        PostModel.collect(req.body).then(result => {
            response(res, result)
        })
    })
    /**
     * 查看收藏
     */
route.get('/showcollect', (req, res) => {
        PostModel.show_collect(req.query.account).then(result => {
            response(res, result)
        })
    })
    // 点赞文章
route.post('/like', (req, res) => {
        PostModel.like(req.body).then(result => {
            response(res, result)
        })
    })
    /**
     * 查看点赞
     */
route.get('/showlike', (req, res) => {
        PostModel.show_like(req.query.account).then(result => {
            response(res, result)
        })
    })
    /**
     * 后台api
     */

//查询待审核文章
route.get('/findarticle', (req, res) => {
    PostModel.findPost(req.query.type).then(result => {
        response(res, result)
    })
})

//查看文章
route.get('/findcontent', (req, res) => {
    PostModel.findcontent(req.query.id).then(result => {
        response(res, result)
    })
})

//更新审核状态
route.post('/updatetype', (req, res) => {
    PostModel.updatetype(req.body).then(result => {
        response(res, result)
    })
})

//删除文章
route.post('/deletearticleid', (req, res) => {
    PostModel.deletearticleid(req.body.id).then(result => {
        response(res, result)
    })
})



module.exports = route