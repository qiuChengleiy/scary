/**
 * 爬取应用配置
 * @param url { String } 要爬取的站点
 * @param context { Object } 新的进程参数（浏览器） @delay: 规定爬取延迟ms
 * @param screenshot { Object } 首页截屏配置
 * @param pdf { Object } 首页转成PDF配置
 * @param  defaultView { Object } 启动参数
 * @param action { Object } 行为配置
 * @param log { Objcet } 日志配置
 * @param disconnected { Boolean } 断开重连
 */
module.exports = {
    url: 'https://www.bilibili.com',
    context: {
        open: false,
        delay: 20000, 
    },
    screenshot: {
        desc: '哔哩哔哩首页',
        open: true,
        name: 'bilibili.jpg',
        savePath: `./files/images/bilibili/`,
    },
    pdf: {
        desc: '哔哩哔哩首页',
        open: true,
        name: 'bilibili.jpg',
        savePath: `./files/pdf/bilibili/`,
        format: 'A4',
    },
    defaultView: {  // 规定视口
        width: 1366,
        height: 768,
        deviceScaleFactor: 1, // 缩放
        isMobile: false,
        hasTouch: false,
    },
    action: {
        type: 'BILI',
    },
    log: {
        open: true,
        name: 'bilibili哔哩哔哩'
    },
    disconnected: false,
}
