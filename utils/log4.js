/** 
 * logger 日志输出
 * @param bilibili { method } 哔哩哔哩爬取日志输出
 * 
*/
module.exports = () => {
    const log4 = require('log4js')
    return {
        output: (options) => {
            const logger = log4.getLogger('index')
            switch(options.type) {
                case 'INFO': 
                  logger.info(options.msg)
                  break
                case 'WARN':
                  logger.warn(options.msg)
                  break
                case 'DEBUG':
                  logger.debug(options.msg)
                  break
                case 'ERROR':
                  logger.error(options.msg)
            }
        }
    }  
}


