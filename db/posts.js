const mongoose = require('mongoose');
const {
    Reason
} = require('./topic')
const Post = mongoose.model('Post', new mongoose.Schema({
    psort: {
        type: String,
        default: '观点'
    }, //文章分类
    phead: {
        type: String
    }, //文章标题
    pauthor: {
        type: String
    }, //文章作者，用户昵称
    puser: {
        type: String
    }, //用户名
    pdate: {
        type: String
    }, //发表时间，时间戳字符串，自己转换
    pabstract: {
        type: String
    }, //文章摘要
    pcontent: {
        type: String
    }, //文章内容
    pcomment: {
        type: Array,
        default: []
    }, //文章评论
    pimg: {
        type: String,
        default: 'http://localhost:3000/images/logo.png'
    },
    isBan: {
        type: String,
        default: '0'
    }, //0待审核， 1 审核通过 -1 审核未通过
    // 文章点赞
    // plike: {
    //     type: Array,
    //     default: []
    // }
}))

const Collect = mongoose.model('Collect', new mongoose.Schema({
        head: {
            type: String
        },
        date: {
            type: String
        },
        author: {
            type: String
        },
        flag: {
            type: String
        },
        abstract: {
            type: String
        },
        account: {
            type: String
        }
    }))
    /**
     * 
     *  收藏 
     */
async function collect(data) {
    try {
        let res = await Collect.findOneAndDelete({
            flag: data.flag,
            account: data.account
        })
        if (res) {
            return {
                code: 200,
                msg: '取消收藏',
                like: true
            }
        } else {
            let collectdata = new Collect({
                head: data.head,
                author: data.author,
                flag: data.flag,
                abstract: data.abstract,
                account: data.account,
                date: new Date().toLocaleDateString()
            })
            await collectdata.save()
            return {
                code: 200,
                msg: '收藏成功',
                like: false
            }
        }

    } catch (error) {
        return {
            code: 500,
            msg: '发生错误'
        }
    }
}
/**
 * 
 * 查看收藏 
 */
async function show_collect(account) {
    try {
        let res = await Collect.find({
            account: account
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
// 点赞集合
const Like = mongoose.model('Like', new mongoose.Schema({
        // 点赞文章标题
        head: {
            type: String
        },
        // 点赞时间
        date: {
            type: String
        },
        // 文章作者
        author: {
            type: String
        },
        // 文章标识符
        flag: {
            type: String
        },
        // 文章摘要
        abstract: {
            type: String
        },
        // 点赞者用户账号
        account: {
            type: String
        },
        // 点赞次数
        count: {
            type: String,
            default: 0
        }
    }))
    // 点赞、取消点赞功能
async function like(data) {
    try {
        let res = await Like.findOneAndDelete({
            flag: data.flag,
            account: data.account
        })
        if (res) {
            return {
                code: 200,
                msg: '取消点赞',
                like: true,
                data: res
                    // count: res.count - 1
                    // icon: 'iconfont icon-dianzan1'
            }
        } else {
            let likedata = new Like({
                head: data.head,
                author: data.author,
                flag: data.flag,
                abstract: data.abstract,
                account: data.account,
                date: new Date().toLocaleDateString(),
                // count: data.count - 0 + 1
            })
            await likedata.save()
                // console.log(likedata);
            return {
                code: 200,
                msg: '点赞成功',
                like: false,
                data: likedata
                    // icon: 'iconfont icon-dianzan'
                    // count: parseInt(likedata.count)
            }
        }

    } catch (error) {
        return {
            code: 500,
            msg: '发生错误'
        }
    }
}
// 点赞、取消点赞功能
// async function getlike(data) {
//     let res = await Like.find({
//         flag: data.id,
//         account: data.account
//     })
//     return {
//         num: res.count - 0
//     }

// }
/**
 * 
 * 查看点赞 
 */
async function show_like(account) {
    try {
        let res = await Like.find({
            account: account
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
 * 文章操作api
 * 存储文章
 * 前台
 */
async function storeposts(data) {
    //数据校验:内容，标题，摘要，分类,作者
    let sort = '分享'
    if (data.sort.length > 0) sort = data.sort
    if (Object.keys(data).length == 7) {
        let post = new Post({
            psort: sort,
            phead: data.head,
            pauthor: data.author,
            pdate: Math.round(new Date() / 1000),
            pabstract: data.abstract,
            pcontent: data.content,
            puser: data.user,
            pimg: data.image == null ? 'http://localhost:3000/images/logo.png' : data.image
        })
        try {
            let result = await post.save()
                // console.log(result)
            if (result) {
                return {
                    code: 200,
                    msg: '文章发表完成，等待审核'
                }
            } else {
                return {
                    code: 400,
                    msg: '发表失败，稍后重试'
                }
            }
        } catch (error) {
            return {
                code: 500,
                msg: '服务器错误:' + error
            }
        }
    }
}


/**
 * 前台
 * 查询全部文章
 */
async function allposts() {
    try {
        let res = await Post.find({
            isBan: '1'
        })
        if (res) {
            let obj = {
                '观点': [],
                '技术': [],
                '新闻': []
            }
            res.forEach((item, index, self) => {
                let now = Math.round(new Date() / 1000)
                    //now - parseInt(item.pdate,10) > 25900  ? self[index].pdate = new Date(parseInt(item.pdate) * 1000).toLocaleString.replace(/:\d{1,2}$/,'') : (function(){}())
                let temp = now - parseInt(item.pdate, 10)
                if (temp >= 259200) {
                    self[index].pdate = new Date(parseInt(item.pdate) * 1000).toLocaleDateString()
                } else if (temp < 259200 && temp >= 172800) {
                    self[index].pdate = '三天前 ' + new Date(parseInt(item.pdate) * 1000).toLocaleTimeString().replace(/:\d{1,2}$/, '')
                } else if (temp < 172800 && temp >= 43200) {
                    self[index].pdate = '昨天 ' + new Date(parseInt(item.pdate) * 1000).toLocaleTimeString().replace(/:\d{1,2}$/, '')
                } else {
                    self[index].pdate = '今天 ' + new Date(parseInt(item.pdate) * 1000).toLocaleTimeString().replace(/:\d{1,2}$/, '')
                }
                switch (item.psort) {
                    case '观点':
                        obj['观点'].push(item)
                        break;
                    case '技术':
                        obj['技术'].push(item)
                        break;
                    case '新闻':
                        obj['新闻'].push(item)
                        break;
                }
            })
            return {
                code: 200,
                data: obj
            }
        } else {
            return {
                code: 400,
                msg: '未查询到数据'
            }
        }
    } catch (error) {
        return {
            code: 500,
            msg: '服务器错误:' + error
        }
    }
}
/**
 * 
 * 模糊查找文章 
 */
async function findsome(data) {
    try {
        let res = await Post.find({
            $or: [{
                pauthor: data.content
            }, {
                phead: new RegExp(data.content)
            }]
        });
        // console.log(res);

        res.forEach((value, index, self) => {
            self[index].pdate = new Date(parseInt(value.pdate) * 1000).toLocaleString().replace(/:\d{1,2}$/, "")
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
 * 文章评论查询
 */


/**
 * 文章评论发表
 */
async function store_comment(data) {
    try {
        let comment = await Post.findOne().where({
                _id: data.head
            })
            // console.log(comment);
        comment.pcomment.push(data.comment)
        let result = await Post.updateOne({
            _id: data.head
        }, {
            pcomment: comment.pcomment
        })
        if (result) {
            return {
                code: 200,
                msg: '发表评论成功'
            }
        } else {
            return {
                code: 400,
                msg: '评论发表失败'
            }
        }
    } catch (error) {
        return {
            code: 500,
            msg: '服务器错误'
        }
    }
}

// 文章点赞
// async function islike(data) {
//     let islike = await Post.findOne().where({
//         _id: data.head,
//     })
//     islike.plike.push(data.head)
//     return {
//         code: 200,
//         msg: '点赞成功',
//         count: islike.plike.length
//     }
// }

/**
 * 查询个人文章
 * 参数: 用户帐号
 * 返回：文章标题，简介，日期，id
 */

async function person_post(user) {
    try {
        let result = await Post.find({
            puser: user
        }, {
            phead: 1,
            pdate: 1,
            pabstract: 1,
            _id: 1
        })
        let newres = []
        result.forEach((item, index, self) => {
            let res = {
                head: item.phead,
                date: new Date(parseInt(item.pdate) * 1000).toLocaleDateString(),
                abstract: item.pabstract,
                flag: item._id
            }
            newres.push(res)
        })
        if (result) {
            return {
                code: 200,
                article: newres
            }
        } else {
            return {
                code: 400,
                msg: '暂未查询到任何结果'
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
 * 根据id查找文章
 */
async function findarticle_id(id) {
    let result = await Post.findOne({
        _id: id
    }, {
        _v: 0
    })
    result.pdate = new Date(parseInt(result.pdate) * 1000).toLocaleDateString()
    if (result) {
        return {
            code: 200,
            content: result
        }
    }
}
/**
 * 根据id更新文章
 */
async function updatebyid(data) {
    let update = {
        psort: data.sort,
        phead: data.head,
        pauthor: data.author,
        pabstract: data.abstract,
        pcontent: data.content,
        pimg: data.image,
        pdate: Math.round(new Date() / 1000).toString()
    }
    try {
        let res = await Post.updateOne({
            _id: data.flag
        }, update)
        if (res) {
            return {
                code: 200,
                msg: '更新成功'
            }
        }
    } catch (error) {
        return {
            code: 400,
            msg: '服务器错误'
        }
    }
}
/**
 * 根据id删除文章
 */
async function deletebyid(id) {
    try {
        let res = await Post.deleteOne({
            _id: id
        })
        if (res) {
            return {
                code: 200,
                msg: '删除成功'
            }
        }
    } catch (error) {
        return {
            code: 500,
            msg: '删除失败'
        }
    }
}
/**
 * 后台文章操作api
 */
async function findPost(type) {
    try {
        let result = await Post.find({
                isBan: type
            }, {
                psort: 1,
                phead: 1,
                _id: 1,
                pimg: 1,
                pauthor: 1,
                pdate: 1
            })
            // console.log(result);
            // 转换日期格式
        result.forEach((val, index, self) => {
            self[index].pdate = new Date(parseInt(val.pdate) * 1000).toLocaleDateString()
        })
        return {
            code: 200,
            data: result
        }
    } catch (error) {
        return {
            code: 500,
            msg: error
        }
    }
}

/**
 * 后台查看文章
 */
async function findcontent(id) {
    try {
        let res = await Post.findOne({
            _id: id
        }, {
            pcontent: 1
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

//更新审核
async function updatetype(data) {
    try {
        let res = await Post.findOneAndUpdate({
            _id: data.id
        }, {
            isBan: data.type
        })
        if (data.type === '-1') {
            //未通过审核
            let reason = new Reason({
                title: res.phead,
                usr: res.puser,
                date: new Date().toLocaleDateString(),
                reason: '你的文章未通过审核'
            })
            await reason.save()
        } else {
            let reason = new Reason({
                title: res.phead,
                usr: res.puser,
                date: new Date().toLocaleDateString(),
                reason: '恭喜你，你的文章已经通过审核'
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
            msg: error
        }
    }
}

//删除文章
async function deletearticleid(id) {
    try {
        await Post.deleteOne({
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

module.exports = {
    storeposts, //存储文章
    allposts, //查询所有文章
    store_comment, //存储评论
    person_post, //查找个人全部文章
    findarticle_id, //查找文章
    updatebyid, //更新文章
    deletebyid, //删除文章
    collect, //收藏文章
    show_collect, //查看收藏
    findsome, //模糊查找
    like, // 点赞
    // islike,
    // getlike, // 点赞总数
    show_like, // 查看点赞

    findPost, //后台api，查询待审核文章
    findcontent, //查看文章
    updatetype, //更新审核状态
    deletearticleid, //后台删除文章
}