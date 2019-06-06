const { Wechaty, Friendship } = require('wechaty')
const schedule = require('./schedule/index')
const config = require('./config/index')

//  二维码生成
function onScan (qrcode, status) {
    require('qrcode-terminal').generate(qrcode)  // 在console端显示二维码
    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')
    console.log(qrcodeImageUrl)
  }


// 登录
async function onLogin (user) {
    console.log(`贴心小助理${user}登录了`)
    // 登陆后创建定时任务
    schedule.setSchedule(config.SENDDATE,()=>{
      console.log('你的贴心小助理开始工作啦！')
     // main()
    })
  }


//登出
function onLogout(user) {
    console.log(`${user} 登出`)
  }


const bot = new Wechaty()

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', message => console.log(`Message: ${message}`))

bot.start()
    .then(() => console.log('开始登陆微信'))
    .catch(e => console.error(e))

