const fs = require("fs")
const path = require("path")
  
// 异步递归创建目录
function mkdirs(dirname, callback) {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            mkdirs(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
            })
        }  
    })
}  

module.exports = { 
    mkdirs, 
}