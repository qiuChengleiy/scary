/** 
 * Bili 爬取动作
 * @param excute { Method } 执行接口
 * @param $sel { Method } DOM选择器
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
        this.zhibo('.nav-con.fl li a[title=直播]')
    }

    async zhibo(sel) {
        const page = await this.$page
        const this_ = this;
        await page.waitFor(1000);    
        await page.waitForSelector(sel); 
        await page.waitFor(1000);  
        await page.click(sel) 
        const info = await page.evaluate(() => {
            console.log(document.location)
            return document.location
        });

        this.log(info,'DEBUG')
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