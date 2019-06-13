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
        this.fs = require('../utils/fs')
        this.jquery = require('cheerio')
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
        const zhuboArr = []
        const baseURL = 'https://live.bilibili.com' 

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
            
            const html = await page.evaluate(() => {
                const liList = document.querySelector('.list-wrap.more .list').innerHTML
                return liList
            });
            const $ = this.jquery.load(html)
            const li = $('.item').nextAll()

            const childs = []

            li.map(key => {
                childs[key] = li[key].children
            })

            // 遍历标签
            for(let i=0;i<childs.length;i++) {
                const child_ = childs[i][0]
                // 房间地址 
                zhuboArr.push({href: `${baseURL}${child_.attribs.href}`})

                for(let j =0;j<child_.children.length;j++) {
                    const bgUrl = child_.children[j].attribs.style
                   
                    // 主播照片
                    if(bgUrl) {
                        const photo = bgUrl.match(/http.{0,}g/ig)
                        zhuboArr[i].photo = photo[j].trim()
                    }
         
                    if(child_.children[j].attribs.class == 'info border-box') {
                        const zhuboInfo = child_.children[j];
                        for(let v=0;v<zhuboInfo.children.length;v++) {
                            const tag = zhuboInfo.children[v]

                            // 用户名
                            if(tag.attribs.class == 'uname') {
                                zhuboArr[i].username = tag.children[v].data.trim()
                            }

                            //  房间名称  
                            // if(tag.attribs.class == 'room-name') {
                            //     zhuboArr[i].roomname = tag.children[v].data.trim()
                            // }

                        }
                    }
                }
            }
            
            // 写入数据
            (async () => {
                this_.log(zhuboArr,'INFO')
                const param = {
                    dir: './files/json/bilibili/',
                    data: zhuboArr,
                    name: './files/json/bilibili/bili.json',
                }
                await this_.fs.mkdirs(param.dir, () => {
                    this_.log(`${param.dir} --> 创建完成`,'DEBUG')
                }); 
                await this_.fs.writeJSON(param)
                await this_.log('数据采集完成','DEBUG')
            })()
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