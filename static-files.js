const path = require('path')
const mime = require('mime')
const fs = require('mz/fs')

// url: 类似 '/static/'
// dir: 类似 __dirname + '/static'
function staticFiles (url, dir) {
  return async (ctx, next) => {
    let rpath = ctx.request.path
    // 判断是否以指定的url开头:
    if (rpath.startsWith(url)) {
      let fp = path.join(dir, rpath.substring(url.length))
      // 获取文件完整路径:
      /*
            Process GET /static/css/bootstrap.css...
            url = /static/;
            - url 是在app.js中调用本模块时传入的路径/static/（注意后面的斜杠），也就是网站开发者指定的static路径
            rpath = /static/css/bootstrap.css;
            - rpath 是写在base.html中的ref链接，也就是浏览器真正请求的url
            dir = /Users/Drolma/Desktop/learn-javascript-master/samples/node/web/koa/view-koa/static;
            - dir 也是在app.js中传入的变量值 __dirname + '/static'，实际是一个相对目录的实例化
            fp = /Users/Drolma/Desktop/learn-javascript-master/samples/node/web/koa/view-koa/static/css/bootstrap.css;
            - fp 最终获取的完整路径
            */
      console.log(`url = ${url}; rpath = ${rpath}; dir = ${dir}; fp = ${fp};  `)
      // 判断文件是否存在:
      if (await fs.exists(fp)) {
        // 查找文件的mime:
        ctx.response.type = mime.lookup(rpath)
        // 读取文件内容并赋值给response.body:（注意是body！是异步操作！）
        ctx.response.body = await fs.readFile(fp)
      } else {
        // 文件不存在:
        ctx.response.status = 404
      }
    } else {
      // 不是指定前缀的URL，继续处理下一个middleware:
      await next()
    }
  }
}

module.exports = staticFiles
