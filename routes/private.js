let express = require('express'),
    route = express.Router(),
    mongoose = require('mongoose'),
    User = require('../db/user');
let response = require('./response');
route.get('/private', (req, res) => {
    User.normaluser().then(result => {
        response(res, result)
    })

})
const private = mongoose.model('Private', new mongoose.Schema({
    uname: {
        type: String
    },
    avatar: {
        type: String
    },
    date: {
        type: String
    },
    gender: {
        type: String
    },
    name: {
        type: String
    },
    nickname: {
        type: String
    },
    content: {
        type: String
    },
    account: {
        type: String
    }
}))
route.post('/writes', (req, res) => {
    write(req.body).then(result => {
        // res.send(result)
        response(res, result)
    })
})
route.post('/findWrite', (req, res) => {
    // console.log(req.body);
    findWrite(req.body.account).then(result => {
        // res.send(result)
        response(res, result)
    })
})
async function write(data) {
    console.log(data);
    let privates = new private({
        avatar: data.avaImg,
        date: data.date,
        gender: data.ugender,
        name: data.uname,
        nickname: data.unickname,
        content: data.content,
        account: data.account,
        uname: data.nickname
    });
    await privates.save();
}

async function findWrite(account) {
    // console.log(account);
    let res = await private.find({
            name: account
        })
        // console.log(res);
    return {
        code: 200,
        data: res
    }
}


module.exports = route