const { Crawler } = require('./utils')
const log4js = require("log4js");
const logSymbols = require('log-symbols')
const options = require('./config/bilibili')
const crawler = new Crawler(options);

// log4初始化配置
log4js.configure('./config/log4.json') && console.log(logSymbols.success,"log4 is starting!")

// 开启爬虫
//crawler.launch()

// 开启批量下载
const download = require('./utils/index').download.downLoad

download({path: './files/images/bilibili/zhubo/', name:'./files/images/bilibili/zhubo/test.jpg' ,url: 'https://i0.hdslb.com/bfs/vc/a4cd591ffe2f60d5c30c273079dcafc66a698820.jpg', pool: 'https'})


