# scary

* nodejs 爬取B站数据 
 
基于 puppeteer+ cheerio，主要思路： 先爬取网页结构(html),再解析html节点的内容，从而拿到数据

日志部分： 基于 log4js

* 爬取微信群成员信息、微信聊天记录 基于 wechaty 库


#### 主要思路

* 扫码登录('qrcode-terminal') -> 登录成功 -> 查找聊天室 ->
  获取所以成员数据 -> 存入json文件 -> 解析文件，处理拿到想要的数据 -> 
  批量下载头像(这里要加请求的域名，登录网页端微信调试一下)

  不是好友关系，所以在拿不到成员的城市信息，性别等信息

* 遇到的问题： 获取聊天室时一定要在登录完成之后在执行

#### 核心部分

```js
/*
 * @Author: Mr.Q
 * @Date: 2019-07-27 18:27:53 
 * @Last Modified time: 2019-07-27 18:27:53 
 */

const { Wechaty, Friendship } = require('wechaty')
const config = require('./config')
const { onScan, onLogin, onLogout } = require('./action')
const fs = require('../utils/fs')

 /**
  * @description 微信机器人类
  */
class Wx {
     constructor() {
        this.wx = new Wechaty()
     }

     async start() {
        await this.onLoad()
     }

     /**
      * @description 监听微信事件
      */
     async onEvent() {
        const wx = await this.wx
        const onMessage = this.onMessage

        // 扫码
        await wx.on('scan',    onScan)
        // 登录
        await wx.on('login',   onLogin)
        // 退出
        wx.on('logout',  onLogout)
        // 监听微信消息
        wx.on('message', message => onMessage(message))

     }

     /**
      * @description 监听微信消息 消息处理
      * @param {Object} mes  消息对象
      */
     async onMessage(mes) {
        console.log(
         `当前收到好友信息 ---->
                  sender: ${mes.from()} 
                  receiver: ${mes.to()}
                  room: ${mes.room()}
                  textMessage: ${mes.text()}
          `
        )
     }

     /**
      * @description  获取微信联系人列表
      * @param {String} 联系人名称
      */
     async contact(name) {
         const bot = this.wx 
         const contactList1 = await bot.Contact.findAll()                      
         const contactList2 = await bot.Contact.findAll({ name })    
         const contactList3 = await bot.Contact.findAll({ alias })  

         return { contactList1, contactList2, contactList3}
     }

     /**
      *
      * @desc 获取微信群信息
      * @param {String} name 群名称
      */
     async zooms(name) {
       const bot = this.wx
       const room = await bot.Room.find({topic: name})
       const members = await room.memberAll()
      // console.log('INFO',members)

       const param = {
         dir: config.dir,
         data: JSON.stringify(members),
         name: config.zoomNumbers,
      }

      await fs.mkdirs(param.dir, () => {
            console.log(`${param.dir} --> 创建完成`,'DEBUG')
      }); 

      await fs.writeJSON(param)

      console.log('数据采集完成~~~')
       
       const otherInfo = () => {
         // 获取群公告
         // const announce = await room.announce()
         // console.log('INFO',announce)

         // 获取群主信息
         // const owner = room.owner()
         // console.log('INFO',owner)
         
         // 获取群头像信息
         // const avat = room.avatar()
         // console.log('INFO',avat)
       }
     }

     /**
      * @description 向微信群发送消息
      * @param {Object} room 当前的聊天室
      * @param {String} mes 消息内容
      */
     async sendZoomMes(room,mes) {
       await room.say('Hello world!')
     }

     /**
      * @description 程序加载时执行
      */
     async onLoad() { 
        await this.onEvent()
        // 登录微信
        await this.wx.start()
            .then(() => console.log('当前信息 ----> ','开始登陆微信'))
            .catch(err => console.log('捕获到异常信息 ----->',err))

        setTimeout(() => this.zooms('前端进阶交流群八'),10000)
     }
 }


 module.exports = Wx

```

#### 数据采集

* /db/*.json  对爬到的数据进行了处理 一个是微信数据，一个是处理后的数据 

* node读写文件操作/目录操作

```js

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

```


#### 文件下载核心部分

```js

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

```







