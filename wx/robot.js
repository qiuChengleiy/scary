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
      * @description  微信联系人
      */
     async contact() {

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

