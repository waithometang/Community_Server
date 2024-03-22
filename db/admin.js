/**
 * 后台admin
 * 此页面只包含后台数据
 */
// const mongoose = require('mongoose');

// const Admin = mongoose.model('Admin', new mongoose.Schema({
//     Ausr: {
//         type: String
//     }, //管理员用户名
//     Apwd: {
//         type: String
//     }, //管理员密码
//     Anickname: {
//         type: String
//     }, //管理员昵称
// }), 'admin')

const mongoose = require('./mongodb');
// 制定集合规则
const adminSchema = new mongoose.Schema({
        aname: {
            type: String
        },
        apwd: {
            type: String
        },
        aavatar: {
            type: String,
            default: 'http://localhost:3000/images/03.jpg'
        },
        date: {
            type: String,
            default: '1970-01-01'
        }
    })
    // 创建集合
const Admin = mongoose.model('Admin', adminSchema);
// 插入数据
// const admin = new Admin({
//         aname: 'admin',
//         apwd: 'admin',
//         aavatar: 'http://localhost:3000/images/03.jpg',
//         date: '1970-01-01'
//     })
//     // 保存数据
// admin.save();
module.exports = Admin;