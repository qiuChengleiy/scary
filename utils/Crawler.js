/**
 * 爬虫操作封装
 * @param options { Object } 参数
 * @param onBrowser { Method } 监听浏览器
 * @param launch { Method } 启动方法
 * @param newBrowser { Method } 打开新的匿名浏览器 -- 开启新进程
 * @param close { Method } 关闭浏览器
 * @param restart { Method } 重启浏览器
 * @param todo { Method } 页面操作
 * @param $sel { Method } 获取DOM元素
 * @param onPage { Method } 监听页面
 * @param callback { Method } 启动回调
 * @param log { Method } 日志输出
 */
class Crawler {
    constructor(options) {
        this.Crawler = require('puppeteer')
        this.logSymbols = require('log-symbols')
        this.fs = require('./fs')
        this.log4 = require('./log4')()
        this.$action = require('../actions')
        this.url = options.url
        this.screenshot = options.screenshot
        this.pdf = options.pdf
        this.defaultView = options.defaultView
        this.context = options.context
        this.action = options.action
        this.disconnected = options.disconnected
        this.log_ = options.log
    }

    onBrowser(browser) {
        // 监听连接断开时 -- 主动触发或者崩溃
        browser.on('disconnected',async () => {
           if(this.disconnected) { 
            const bwsp_ = await browser.wsEndpoint()
            this.restart(bwsp_)
           }else {
               console.log(this.logSymbols.warning,'已断开连接')
           }  
        })
    }

    launch() {
        const this_ = this;
        this.Crawler.launch({
            ignoreDefaultArgs: ['--mute-audio'],
            defaultViewport: this_.defaultView
        }).then((browser) => this_.callback(browser,this_) && console.log(this_.logSymbols.success,'已连接'))
    }

    async newBrowser(browser) {
        const context = browser.createIncognitoBrowserContext()  //创建匿名浏览器
        const page_ = await context.newPage() // 打开新的页面
        await page_.goto(this.context.url)
        await this.todo(browser)
    }

    close(browser) {
        browser.close();
    }

    async restart(bwsp) {
        const browser = await this.Crawler.connect({bwsp})
        this.callback(browser)
    }

    async todo(browser,page) {
        this.page = page
        this.browser = browser
        await page.setRequestInterception(true)
        await this.onBrowser(browser) 
        await this.onPage(browser,page)
        await new this.$action({log: this.log_, page, type: this.action.type}).onReady()
    }

    async onPage(browser,page) {
        // 监听页面关闭
        page.on('console', msg => {
            for (let i = 0; i < msg.args().length;i++)
              this.log(`${i}: ${msg.args()[i]}`,'INFO')
        });

        // 监听页面请求 --- intercept过滤不必要的请求
        page.on('request',(interceptedRequest) => {
            const pngIntercept = interceptedRequest.url().endsWith('.png')
            const jpgIntercept = interceptedRequest.url().endsWith('.jpg')
            if (pngIntercept || jpgIntercept){
                 interceptedRequest.abort()
              }else{
                 interceptedRequest.continue()
            }
            this.log('页面发生请求 --- 已拦截jpg||png资源请求','INFO')
        })
        
        // 监听页面请求失败
        page.on('requestfailed', () => {
            this.log('页面请求失败','ERROR')
        }) 

         // 监听页面请求完成
         page.on('requestfinished', () => {
            this.log('页面请求完成','INFO')
        })

        // 监听页面请求接收到响应
        page.on('response', () => {
            this.log('页面请求接收到响应','DEBUG')
        })
    }

    async callback(browser,this_) {
        const page = await browser.newPage()
        const $asset_path = this_.screenshot.savePath
        await page.goto(this_.url)
        await this_.todo(browser,page) 
        await this_.fs.mkdirs(this_.screenshot.savePath, () => {
            this_.log(`${this_.screenshot.savePath} --> 创建完成`,'DEBUG')
        }); 
        await this_.fs.mkdirs(this_.pdf.savePath, () => {
            this_.log(`${this_.pdf.savePath} --> 创建完成`,'DEBUG')
        }); 

        this_.screenshot.open ? (await page.screenshot({path: this_.screenshot.savePath + this_.screenshot.name }) 
            && this_.log(`${this_.screenshot.desc} --> 窥屏success O(∩_∩)O~`,'DEBUG'))
            : console.log(logSymbols.warning,'no open screen shot ------ [WARN    ${this.log_.name}]')

        this_.pdf.open ? (await page.pdf({path: this_.pdf.savePath + this_.pdf.name ,format: this_.pdf.format}) 
            && this_.log(`${this_.pdf.desc} --> 转成pdf success O(∩_∩)O~`,'DEBUG'))
            : console.log(logSymbols.warning,'no open pdf shot ------ [WARN    ${this.log_.name}]')

        browser.version().then(res => console.log(this.logSymbols.info,`$version ---> ${res} ------ [WARN    浏览器信息]`) )
        browser.userAgent().then(res => console.log(this.logSymbols.info,`$userAgent ---> ${res} ------ [WARN    浏览器信息]`))
        await page.waitFor(this_.context.delay);
        this_.context.open ? this_.newBrowser(browser) : await this_.close(browser) 
    }

    async log(info = '',level) {
         this.log_.open ? this.log4.output({
            type: 'INFO',
            msg: `${info} ----- [${level}    ${this.log_.name}]`,
         }) : console.log(this.logSymbols.warning,'log4 is closed')
    }
}

module.exports = Crawler


