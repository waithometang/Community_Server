/**
 * 
 * @param { *function 回调钩子 } res
 * @param {*返回给客户端数据} data 
 * @param {*状态码：success:200,error:400,false:500} status 
 * @param {*返回格式：default:application/json} type 
 */
function response(res,data={code:200},status=200,type="application/json"){
    res.status(status);
    res.type(type);
    res.send(data)
}

module.exports = response