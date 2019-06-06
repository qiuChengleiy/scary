/** 
 * Action 爬取行为封装
 * @param onReady { Method } 实例化准备
 * @param onComplete { Method } 实例化完成
 * @param onStart { Method } 开始爬取
 * @param log { Method } 日志输出
*/
class Action {
    constructor(options) {
        this.bili = require('./bili')
        this.logSymbols = require('log-symbols')
        this.log4 = require('../utils/log4')()
        this.log_ = options.log
        this.page = options.page
        this.type = options.type
    }

    async onReady() {
         this.$bili = await new this.bili({page: this.page, log: this.log_}) 
         this.onComplete('bili实例化完成')  
    }

    async onComplete(info) {
        await this.log(info,'INFO')
        this.onStart()
    }

    onStart() {
        switch(this.type) {
            case 'BILI':
               this.$bili.excute() && this.log('BILI 爬取行为开始执行','WARN')
               break
            default: 
                this.log('暂无行为~~','INFO')
                break
        }  
    }

    log(info = '',level) {
        this.log_.open ? this.log4.output({
           type: 'INFO',
           msg: `${info} ----- [${level}    ${this.log_.name}]`,
        }) : console.log(this.logSymbols.warning,'log4 is closed') 
   }


}

module.exports = Action