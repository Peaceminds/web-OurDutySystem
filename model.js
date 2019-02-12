// scan all models defined in models:
const fs = require('fs')
const db = require('./db')

let files = fs.readdirSync(__dirname + '/models')

let js_files = files.filter((f) => {
  return f.endsWith('.js')
}, files)

module.exports = {}

/*
注意1 ----------
这实际是用for将model.js的导出变成了一个object对象,例如这个例子:
    model.exports[Cases] 实际就等于 ./models/Cases.js
所以在app.js中调用 model.Cases 的时候也就等于调用 ./models/Cases.js
static-files.js原理同样

注意2 ----------
导出是在这里，sync导出实际是执行了数据库的sync()方法
*/
for (let f of js_files) {
  console.log(`import model from file ${f}...`)
  let name = f.substring(0, f.length - 3)
  module.exports[name] = require(__dirname + '/models/' + f)
}

module.exports.sync = () => {
  db.sync()
}
