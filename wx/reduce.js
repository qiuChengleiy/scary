// 数据解析
const db = require('../db/wx.zoom.json')
const fs = require('../utils/fs')
const data = JSON.parse(db)
const people = []

async function dbCharge() {

    await data.map((item) => {
        const info = item.payload
        const name = info.name
        const avar = info.avatar
        const friend = info.friend
        const robot = info.signature ? true : false

        people.push({ name, avar, friend, robot})
    })

    const param = {
        dir: './db/',
        data: JSON.stringify(people),
        name: './db/qianduan.zoom.json',
     }
    
     await fs.mkdirs(param.dir, () => {
           console.log(`${param.dir} --> 创建完成`,'DEBUG')
     }); 
    
     await fs.writeJSON(param)
    
     console.log('数据处理完成~~~')
}


// 开启批量下载  
const UserData = require('../db/qianduan.zoom.json')
const download = require('../utils/index').download.downLoad
const _db = JSON.parse(UserData)

_db.map(item => {
    download({path: '../db/avatar/', name:`../db/avatar/${item.name}.jpg` ,url: `https://wx2.qq.com/${item.avar}`, pool: 'https'})
})


