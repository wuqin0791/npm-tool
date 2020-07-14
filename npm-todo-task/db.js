/*
 * @Description: This is a db file
 * @Author: JeanneWu
 * @Date: 2020-07-13 16:47:33
 */
// js文件头部注释之后的内容
const fs = require('fs')
const path = require('path')
const homeDir = require('os').homedir()
const home = process.env.HOME || homeDir
const dbPath = path.join(home, '.todo')

const db = {
  read(path = dbPath) {

    return new Promise((resolve, reject) => {
      // 由于readFile是异步的，所以用promise来处理，拿到结果
      fs.readFile(path, {
        flag: 'a+',
        encoding: 'utf8'
      }, (err, data) => {
        if (err) return reject(err)
        let list
        try {
          list = JSON.parse(data.toString())
        } catch (err) {
          list = []
        }
        resolve(list)
      })
    })

  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string + '\n', (err) => {
        if (err) return reject(err)
      })
      resolve(list)
    })

  }
}
module.exports = db