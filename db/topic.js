const mongoose = require('mongoose')

const Topic = mongoose.model('Topic', new mongoose.Schema({
    thead: {
        type: String
    }, //帖子标题
    tname: {
        type: String
    }, //帖子发表用户
    tusr: {
        type: String
    }, //用户账号
    tcontent: {
        type: String
    }, //帖子内容
    timage: {
        type: Array,
        default: []
    },
    tcomment: {
        type: Array,
        default: []
    }, //评论，暂定string,以后可能为 Array[object]
    tdate: {
        type: String
    }, //发表时间，存为字符串时间戳，使用时自己转换
    tban: {
        type: String,
        default: 0
    }, //帖子审核标记 0待审核 1通过 -1不通过
    showcomment: {
        type: Boolean,
        default: false
    },
}))

const Reason = mongoose.model('Reason', new mongoose.Schema({
        title: String, //文章或帖子标题
        usr: String, //帐户名
        reason: {
            type: String,
            default: ' 恭喜你的内容通过审核'
        }, //审核未通过原因
        date: String //时间
    }))
    /**
     * 前台页面api
     * 
     */
    /**
     * 帖子发布
     */
async function storetopic(data) {
    let topic = new Topic({
        thead: data.head,
        tname: data.nickname,
        tusr: data.account,
        tcontent: data.content,
        tdate: Math.round(new Date() / 1000),
        timage: data.image
    })
    try {
        await topic.save()
        return {
            code: 200,
            msg: '发表成功'
        }
    } catch (error) {
        return {
            code: 400,
            msg: '发表失败'
        }
    }
}
/**
 * 查询个人帖子
 */
async function findPerson(id) {
    try {
        let res = await Topic.find({
            tusr: id
        }, {
            thead: 1,
            tcontent: 1,
            tdate: 1,
            _id: 1
        })
        let newres = []
        for (let item of res) {
            newres.push({
                head: item.thead,
                content: item.tcontent,
                date: new Date(parseInt(item.tdate) * 1000).toLocaleDateString(),
                flag: item._id
            })
        }
        return {
            code: 200,
            data: newres
        }
    } catch (error) {
        return {
            code: 400,
            msg: '查找失败'
        }
    }
}

/**
 * 查询单篇帖子
 */
async function findSingle(id) {
    try {
        let res = await Topic.findOne({
            _id: id
        })

    } catch (error) {
        return {
            code: 400,
            msg: '获取失败'
        }
    }
}
/**
 * 查询所有帖子
 */
async function findAll() {
    try {
        let res = await Topic.find({})
        res.forEach((value, index, self) => {
            self[index].tdate = new Date(parseInt(value.tdate) * 1000).toLocaleString().replace(/:\d{1,2}$/, "")
        })
        return {
            code: 200,
            data: res
        }
    } catch (error) {
        return {
            code: 400,
            msg: '没有查询任何数据'
        }
    }
}
/**
 * 
 * 模糊查询 
 */
async function findsome(data) {
    try {
        let res = await Topic.find({
            $or: [{
                tname: data.content
            }, {
                thead: new RegExp(data.content)
            }]
        })
        res.forEach((value, index, self) => {
            self[index].tdate = new Date(parseInt(value.tdate) * 1000).toLocaleString().replace(/:\d{1,2}$/, "")
        })
        return {
            code: 200,
            data: res
        }
    } catch (error) {
        return {
            code: 500,
            msg: '服务器发生错误'
        }
    }
}

/**
 * 
 * 删除个人帖子 
 */
async function delete_person_topic(id) {
    try {
        // console.log(id)
        let res = await Topic.findOneAndDelete({
            _id: id
        })
        return {
            code: 200,
            msg: '删除成功'
        }
    } catch (error) {
        return {
            code: 500,
            msg: '删除失败'
        }
    }
}

/**
 * 新增评论
 */
async function comment(data) {
    try {
        await Topic.updateOne({
            _id: data.id
        }, {
            $push: {
                tcomment: data
            }
        })
        return {
            code: 200,
            msg: '评论成功'
        }
    } catch (error) {
        // console.log(error)
        return {
            code: 500,
            msg: '评论失败'
        }
    }
}
/**
 * 
 * 查询提示消息 
 */
async function message(account) {
    try {
        let res = await Reason.find({
            usr: account
        })
        return {
            code: 200,
            data: res
        }
    } catch (error) {
        return {
            code: 500
        }
    }
}

/**
 * 
 * 通知消息已查看，删除消息 
 */
async function delete_message(id) {
    try {
        await Reason.findOneAndDelete({
            _id: id
        })
        return {
            code: 200
        }
    } catch (error) {
        return {
            code: 500
        }
    }
}



/**
 * 后台页面api
 */

//查询所有待审核帖子,已通过帖子
async function findtopics(type) {
    try {
        let res = await Topic.find({
            tban: type
        }, {
            thead: 1,
            tname: 1,
            tdate: 1,
            _id: 1
        })
        res.forEach((val, index, self) => {
            self[index].tdate = new Date(parseInt(val.tdate) * 1000).toLocaleDateString()
        })
        return {
            code: 200,
            data: res
        }
    } catch (error) {
        return {
            code: 500,
            msg: '没有数据'
        }
    }
}

//查询帖子内容
async function topiccontent(id) {
    try {
        let res = await Topic.findOne({
            _id: id
        }, {
            tcontent: 1,
            timage: 1,
            thead: 1
        })
        return {
            code: 200,
            data: res
        }
    } catch (error) {
        return {
            code: 500,
            msg: error
        }
    }
}

//帖子审核
async function allowban(data) {
    try {

        if (data.type === '1') {
            let res = await Topic.findOneAndUpdate({
                    _id: data.id
                }, {
                    tban: data.type
                })
                //通过审核
            let reason = new Reason({
                title: res.thead,
                usr: res.tusr,
                date: new Date().toLocaleDateString()
            })
            await reason.save()
        } else {
            let res = await Topic.findOneAndDelete({
                _id: data.id
            })
            let reason = new Reason({
                title: res.thead,
                usr: res.tusr,
                date: new Date().toLocaleDateString(),
                reason: data.reason + ' 该帖子已被管理员删除'
            })
            await reason.save()
        }
        return {
            code: 200,
            msg: '操作成功'
        }
    } catch (error) {
        return {
            code: 500,
            msg: '操作失败,稍后重试'
        }
    }
}

//根据id删除帖子
async function deleteTopic(id) {
    try {
        let res = await Topic.findOneAndDelete({
            _id: id
        })
        let reason = new Reason({
            title: res.thead,
            usr: res.tusr,
            date: new Date().toLocaleDateString(),
            reason: ' 该帖子已被管理员删除'
        })
        await reason.save()
        return {
            code: 200,
            msg: '删除成功'
        }
    } catch (error) {
        // console.log(error)
        return {
            code: 500,
            msg: '操作失败，稍后重试'
        }
    }
}

// 私信
function letterPrivate(data) {
    return {
        msg: '你好',
        code: 200
    }
}

module.exports = {
    storetopic, //发表帖子
    findPerson, //查找个人帖子
    delete_person_topic, //删除个人帖子
    findAll, //查询所有帖子
    comment, //评论
    message, //消息通知
    delete_message, //删除通知消息
    findsome, //模糊查询帖子
    letterPrivate, // 私信
    findtopics, //后台api,查询各类型帖子
    topiccontent, //后台，查看帖子内容
    allowban, //后台，审核帖子
    deleteTopic, //后台，删除帖子
    Reason,
}