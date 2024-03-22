let mongoose = require('mongoose');
let database = 'itcommunity'
let db = 'mongodb://localhost:27017/' + database;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, err => {
    if (err) {
        console.log('数据库连接失败');
        return;
    }
    console.log('数据库连接成功');
})

module.exports = mongoose;