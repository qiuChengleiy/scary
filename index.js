const { Crawler } = require('./utils')
const log4js = require("log4js");
const logSymbols = require('log-symbols')
const options = require('./config/bilibili')
const crawler = new Crawler(options);
crawler.launch()
log4js.configure('./config/log4.json') && console.log(logSymbols.success,"log4 is starting!")
