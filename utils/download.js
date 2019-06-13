/**
 * downLoad 批量下载数据
 */
const http = require('http')
const https = require('https')
const fs = require('fs')
const fsU = require('./fs')

async function downLoad(param) {
   let request = null;
   await fsU.mkdirs(param.path, () => {
       console.log(`${param.path} --> 创建完成`,'DEBUG')
    })

   const ws = await fs.createWriteStream(param.name)
   if(param.pool == 'http') {
       request = http
   }else if(param.pool == 'https') {
       request = https
   }

   request.get(param.url,(res) => {
       let totalBytes = 0
       let perBytes = 0
       let t = 0

       res.pipe(ws)
       totalBytes = parseInt(res.headers['content-length'], 10)
       
       res.on('data', (chunk) => {
           perBytes+=chunk.length
       })

       let timer = setInterval(() => {
           console.log(`当前下载速度 ${perBytes}k/s`)
           console.log(`已完成 --->${((perBytes/totalBytes).toFixed(2))*100} %`)
       },0)

       let time = setInterval(() => t++, 1000)

       res.on('close', () => {
           clearInterval(timer)
           clearInterval(time)
           console.log('下载完毕 ----> 耗时' + `${t}s`)
       })
   })
}


module.exports = {
    downLoad,
}








