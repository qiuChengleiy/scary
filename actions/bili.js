/** 
 * Bili 爬取动作
 * @param excute { Method } 执行接口
 * @param $sel { Method } DOM选择器
 * @param zhibo { Method } 爬取bili直播页面
 * @param log { Method} log4行为日志输出
*/
class Bili {
    constructor(options) {
        this.logSymbols = require('log-symbols')
        this.log4 = require('../utils/log4')()
        this.log_ = options.log
        this.$page = options.page
    }

    async excute() {
        this.zhibo('.nav-item.live')
    }

    async zhibo(sel) {
        const options = { 
            $yanzhi: '.title.pointer.f-left'
        }
        const page = await this.$page
        const this_ = this
        const data = {}

      try {
            await page.waitFor(1000);    
            await page.waitForSelector(sel)
            await page.waitFor(1000)

            // 无法传参数进去
            const url = await page.evaluate(() => {
                return document.querySelector('.nav-item.live a').href
            });

            await page.waitFor(100)
            await page.goto(url)
            await page.waitFor(1000)
            await page.waitForSelector(options.$yanzhi)
            await page.click("a[class='title pointer f-left']")
            await page.waitFor(1000)
            
            const urls = await page.evaluate(() => {
                return document.location.href
            });

            console.log(urls)
      } catch(err) {
        this.log(err,'ERROR')
      }
    }

    async $sel(selector) {
        const element = await this.$page.$(selector)
        this.log(`已获取到元素 --> ${element}`,'INFO')
        return element
    }

    log(info = '',level) {
        this.log_.open ? this.log4.output({
           type: 'DEBUG',
           msg: `${info} ----- [${level}    ${this.log_.name}]`,
        }) : console.log(this.logSymbols.warning,'log4 is closed') 
   }
}

module.exports = Bili