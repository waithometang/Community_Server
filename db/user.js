const mongoose = require('./mongodb');
const Admin = require('./admin');
/*
 *   user 表
 *   用户登录，注册验证
 *
 */
const User = mongoose.model('User', new mongoose.Schema({
    uname: {
        type: String
    }, //用户名
    upwd: {
        type: String
    }, //用户密码
    ugender: {
        type: String,
        default: '未定义'
    }, //用户性别
    unickname: {
        type: String,
        default: '佚名'
    }, //昵称
    udate: {
        type: String
    }, //注册日期
    uavatar: {
        type: String,
        default: 'http://localhost:3000/images/03.jpg'
    }, // 头像
    uis: {
        type: Boolean,
        default: false
    }, // 是否禁止登录
}), 'user')

//验证用户登录
async function user_login(user_data = {}) {
    // console.log(user_data);
    //虽然客户端会校验不允许发送空数据，但是在服务端还是应该再校验一遍
    if (Object.keys(user_data).length > 0) {
        try {
            let res = await User.findOne(user_data, {
                    // upwd: 0,
                    // uis: 0,
                    // _id: 0,
                    // _v: 0
                })
                // console.log(res);
            let newres = {
                account: res.uname,
                nickname: res.unickname,
                date: res.udate,
                gender: res.ugender,
                avatar: res.uavatar,
                uis: res.uis
            }
            if (res) {
                return {
                    code: 200,
                    userinfo: newres
                }
            } else {
                return {
                    code: 400,
                    msg: '用户名或密码错误'
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: '发生未知错误'
            }
        }
    }
}
//用户注册
async function user_regist(user_data = {}) {
    if (Object.keys(user_data).length == 2) {
        try {
            let res = await User.findOne({
                uname: user_data.usrname
            })
            if (res) {
                return {
                    code: 400,
                    msg: '此用户已注册'
                }
            } else {
                let now = new Date().toLocaleDateString()
                let usr = new User({
                    uname: user_data.usrname,
                    upwd: user_data.pwd,
                    udate: now
                })
                let res = await usr.save();
                let newres = {
                    account: res.uname,
                    nickname: res.unickname,
                    date: res.udate,
                    gender: res.ugender,
                    avatar: res.uavatar
                }
                return {
                    code: 200,
                    msg: res.uname + ' 注册成功',
                    userinfo: newres
                }
            }
        } catch (err) {
            return {
                code: 500,
                msg: '服务器错误'
            }
        }
    }
}

/**
 * 修改资料
 * 可修改用户名和性别
 */
async function updateinfo(data) {
    try {
        let result = await User.updateOne({
            uname: data.account
        }, {
            unickname: data.nickname,
            ugender: data.gender
        })
        if (result) {
            return {
                code: 200,
                msg: '更新成功'
            }
        } else {
            return {
                code: 400,
                msg: '更新资料失败，稍后再试'
            }
        }
    } catch (err) {
        return {
            code: 500,
            msg: '服务器错误'
        }
    }
}
/**
 * 更新头像
 */
async function updateavatar(data, url) {
    try {
        let res = await User.updateOne({
            uname: data
        }, {
            uavatar: url
        })
        if (res) {
            return {
                code: 200,
                msg: '更新成功',
                url: url
            }
        } else {
            return {
                code: 400,
                msg: '头像更新失败'
            }
        }
    } catch (error) {
        return {
            code: 500,
            msg: '服务器错误'
        }
    }
}



/**
 * 后台管理
 */
// const Admin = mongoose.model('Admin', new mongoose.Schema({
//     aname: {
//         type: String
//     },
//     apwd: {
//         type: String
//     },
//     aavatar: {
//         type: String,
//         default: 'http://localhost:3000/images/03.jpg'
//     },
//     date: {
//         type: String,
//         default: '1970-01-01'
//     }
// }))

//管理员登录
async function admin_login(data) {
    try {
        let result = await Admin.findOne(data);
        return ({
            code: 200,
            data: result
        })
    } catch (error) {
        return {
            code: 500,
            msg: error
        }
    }
}

//查询普通用户
async function normaluser() {
    try {
        let res = await User.find({}, {
            _v: 0,
            upwd: 0
        })
        return {
            code: 200,
            data: res
        }
    } catch (error) {
        return {
            code: 500,
            msg: '查询出错'
        }
    }
}

//禁止普通用户登录,解封
async function user_banned(data) {
    try {
        await User.findOneAndUpdate({
            _id: data.id
        }, {
            uis: data.type
        })
        return {
            code: 200,
            msg: '操作成功'
        }
    } catch (error) {
        return {
            code: 500,
            msg: '操作失败'
        }
    }
}


//查询管理员
async function root() {
    try {
        let res = await Admin.find()
        return {
            code: 200,
            data: res
        }
    } catch (error) {
        return {
            code: 500,
            msg: '发生错误'
        }
    }
}

//新增管理员
async function new_root(data) {
    try {
        let exist = await Admin.findOne({
            aname: data.account
        })
        if (!exist) {
            let root = new Admin({
                aname: data.account,
                apwd: data.pwd,
                date: new Date().toLocaleDateString()
            })
            await root.save()
            return {
                code: 200,
                msg: '新增管理员成功'
            }
        } else {
            return {
                code: 400,
                msg: '该账号已存在'
            }
        }
    } catch (error) {
        return {
            code: 500,
            msg: '操作失败'
        }
    }
}

//删除管理员

async function delete_root(id) {
    try {
        await Admin.findOneAndDelete({
            _id: id
        })
        return {
            code: 200,
            msg: '删除成功'
        }
    } catch (error) {
        return {
            code: 500,
            msg: '操作失败'
        }
    }
}

module.exports = {
    user_login, //用户登录
    user_regist, //用户注册
    updateinfo, //更新资料
    updateavatar, //更新头像

    admin_login, //后台登录
    normaluser, //后台查看普通用户
    root, //后台查询管理员账号
    new_root, //新增管理员
    delete_root, //删除管理员
    user_banned, //禁止用户登录

}