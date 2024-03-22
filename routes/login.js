let express = require('express');
let route = express.Router();
let response = require('./response')
const UserModel = require('../db/user')
    /*
     login 接口
     params{
         usrname:string,
         pwd:string
     }
    */
route.post('/login', (req, res) => {
    UserModel.user_login({
        uname: req.body.usrname,
        upwd: req.body.pwd
    }).then(result => {
        response(res, result)
    })
});


/*
api:regist
params:{
    usrname:string,
    pwd:string,
    pwd2:string
}

*/
route.post('/regist', (req, res) => {
    UserModel.user_regist(req.body).then(result => {
        response(res, result)
    })
});

route.post('/updateinfo', (req, res) => {
    UserModel.updateinfo(req.body).then(result => {
        response(res, result)
    })
})

/**
 * 后台操作
 */
//管理员登录
route.get('/admin', (req, res) => {
    UserModel.admin_login(req.query).then(result => {
        response(res, result)
    })
})

//查看所有普通用户
route.get('/normaluser', (req, res) => {
    UserModel.normaluser().then(result => {
        response(res, result)
    })
})

//普通用户封号，解封
route.get('/userban', (req, res) => {
    UserModel.user_banned(req.query).then(result => {
        response(res, result)
    })
})

//查询管理员
route.get('/root', (req, res) => {
    UserModel.root().then(result => {
        response(res, result)
    })
})

//新增管理员
route.post('/newroot', (req, res) => {
    UserModel.new_root(req.body).then(result => {
        response(res, result)
    })
})

//删除管理员
route.get('/deleteroot', (req, res) => {
    UserModel.delete_root(req.query.id).then(result => {
        response(res, result)
    })
})





module.exports = route;