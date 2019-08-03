/*
 * @Author: Mr.Q
 * @Date: 2019-07-27 18:19:54 
 * @Last Modified time: 2019-07-27 18:21:05
 */
const config = require('./config')

 /**
  * @description  微信扫码登录
  * @param {String} qrcode 
  * @param {Boolean} status 
  */
 async function onScan (qrcode, status) {
    // 在console端显示二维码
    if(config.qrCode == 'terminal') {
      await require('qrcode-terminal').generate(qrcode)  
    }
   
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')
    
    console.log(qrcodeImageUrl)
  }

/**
 * @description 登录回调
 * @param {String} user 用户名称 
 */
async function onLogin (user) {
  console.log(`温馨提示您${user}登录了`)

}

/**
 * @description 退出回调
 * @param {String} user 用户名称 
 */
async function onLogout (user) {
  console.log(`温馨提示您${user}下线了`)

}


module.exports = {
  onLogin,
  onLogout,
  onScan,
}




  

