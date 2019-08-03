/*
 * @Author: Mr.Q
 * @Date: 2019-07-27 18:27:53 
 * @Last Modified time: 2019-07-27 18:27:53 
 */

const { Wechaty, Friendship } = require('wechaty')
const config = require('./config')
import { onScan, onLogin, onLogout } from './action'

 /**
  * @description 微信机器人类
  */
class Wx {
     constructor() {
        this.wx = new Wechaty()
     }

     async start() {
        await this.onLoad()
        await this.zooms('前端进阶交流群八')
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
        this.log('当前收到好友信息 ---->',
          `sender: ${mes.from()} 
           receiver: ${mes.to()}
           room: ${mes.room()}
           textMessage: ${mes.text()}
           annexMessage: ${mes.toFileBox()}
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
       this.log('INFO',members)
       
       // 获取群公告
       const announce = await room.announce()
       this.log('INFO',announce)

       // 获取群主信息
       const owner = room.owner()
       this.log('INFO',owner)
       
       // 获取群头像信息
       const avat = room.avatar()
       this.log('INFO',avat)
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
        // 登录微信
        this.wx.start()
            .then(() => this.log('当前信息 ----> ','开始登陆微信'))
            .catch(err => this.log('捕获到异常信息 ----->',err))
     }

     /**
      * @description  日志输出
      * @param {String} status  日志状态
      * @param {String} info   日志信息
      */
     log(status,info) {
         console.log(`${status} ----->  ${info}`)
     }
 }


 module.exports = Wx

