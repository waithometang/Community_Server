let express = require('express'),
    route = express.Router(),
    multer = require('multer'),
    mongoose = require('mongoose'),
    User = require('../db/user');
let response = require('./response');
const {
    Reason
} = require('./topic')
const upload = multer({
    dest: 'public/images/'
})
const video = multer({
    dest: 'public/video'
})
const Video = mongoose.model('Video', new mongoose.Schema({
        user: {
            type: String
        },
        account: {
            type: String
        },
        url: {
            type: String
        },
        date: {
            type: String
        },
        name: {
            type: String
        }
    }))
    /**
     * 处理图片和视频上传
     * 
     */
async function saveviedeo(data) {
    try {
        await data.save()
        return {
            code: 200,
            msg: '上传成功'
        }
    } catch (error) {
        return {
            code: 500,
            msg: '上传失败'
        }
    }
}

async function findvideo() {
    try {
        let res = await Video.find({})
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


route.post('/upload', upload.single('img'), (req, res) => {
    let file = req.file;
    res.send({
        code: 200,
        url: 'http://localhost:3000/images/' + file.filename
    })
})
route.post('/uploadvideo', video.single('video'), (req, res) => {
    // console.log(req);
    let file = req.file
    let video = new Video({
        user: req.body.user,
        account: req.body.account,
        date: new Date().toLocaleDateString(),
        url: 'http://localhost:3000/video/' + file.filename,
        name: file.originalname.split('.')[0]
    })
    saveviedeo(video).then(result => {
        res.send(result)
    })

})
route.get('/videos', (req, res) => {
    findvideo().then(result => {
        res.send(result)
    })

})

/**
 * 更新用户头像 
 */
route.post('/updateavatar', upload.single('file'), (req, res) => {
    let file = req.file
    User.updateavatar(req.body.user, 'http://localhost:3000/images/' + file.filename).then(result => {
        res.send(result);
    })
})

route.get('/private', (req, res) => {
    User.normaluser().then(result => {
        response(res, result)
    })
})



module.exports = route