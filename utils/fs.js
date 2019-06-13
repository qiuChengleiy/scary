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

// 写入JSON数据
async function writeJSON(param) {
    const beforeData = await fs.readFileSync(param.name,{encoding: 'utf-8'})
    if(beforeData && beforeData !== 'undefined') {
        const data = await JSON.parse(beforeData)
        await param.data.push(data)
    }
    await fs.writeFileSync(param.name, JSON.stringify(param.data),{encoding: 'utf-8'})
}

module.exports = { 
    mkdirs, 
    writeJSON,
}