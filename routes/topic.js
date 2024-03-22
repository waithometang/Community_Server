let express = require('express');
let route = express.Router();
let response = require('./response')
const Topic = require('../db/topic')

/**
 * 发表帖子
 */
route.post('/store', (req, res) => {
        Topic.storetopic(req.body).then(result => {
            response(res, result)
        })
    })
    /**
     * 查询个人帖子
     */
route.get('/mytopic', (req, res) => {
        Topic.findPerson(req.query.account).then(result => {
            response(res, result)
        })
    })
    /**
     * 模糊查询帖子
     */
route.post('/findsome', (req, res) => {
        Topic.findsome(req.body).then(result => {
            response(res, result)
        })
    })
    /**
     * 删除个人帖子
     */
route.get('/deleteit', (req, res) => {
    Topic.delete_person_topic(req.query.id).then(result => {
        response(res, result)
    })
})

route.get('/alltopics', (req, res) => {
    Topic.findAll().then(result => {
        response(res, result)
    })
})

/**
 * 评论
 */
route.post('/comment', (req, res) => {
        Topic.comment(req.body).then(result => {
            response(res, result)
        })
    })
    /**
     * 查询提示信息
     */
route.get('/message', (req, res) => {
    Topic.message(req.query.account).then(result => {
        response(res, result)
    })
})

/**
 * 删除提示消息
 */
route.get('/delete_message', (req, res) => {
    Topic.delete_message(req.query.id).then(result => {
        response(res, result)
    })
})

/**
 * 后台api
 */

//查询帖子
route.get('/adminalltopics', (req, res) => {
    Topic.findtopics(req.query.type).then(result => {
        response(res, result)
    })
})

//查看帖子内容
route.get('/single', (req, res) => {
    Topic.topiccontent(req.query.type).then(result => {
        response(res, result)
    })
})

//审核帖子
route.post('/allowban', (req, res) => {
    Topic.allowban(req.body).then(result => {
        response(res, result)
    })
})

//删除帖子
route.post('/deletetopicid', (req, res) => {
    Topic.deleteTopic(req.body.id).then(result => {
        response(res, result)
    })
})

// 私信
route.post('/letter', (req, res) => {
    Topic.letterPrivate(req.body).then(result => {
        response(res, result)
    })
})










module.exports = route;