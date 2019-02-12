const url = require('url')
const Cookies = require('cookies')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')
const templating = require('./templating')
const rest = require('./rest')
// const dbInitializer = require('./db-test-data')

const app = new Koa()

const isProduction = process.env.NODE_ENV === 'production'

// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  var start = new Date().getTime()
  var execTime
  await next()
  execTime = new Date().getTime() - start
  ctx.response.set('X-Response-Time', `${execTime}ms`)
})

// parse user from cookie:
app.use(async (ctx, next) => {
  ctx.state.myusername = parseUser(ctx.cookies.get('myusername') || '')
  await next()
})

// static file support:
if (!isProduction) {
  let staticFiles = require('./static-files')
  app.use(staticFiles('/static/', __dirname + '/static'))
}

// parse request body:
app.use(bodyParser())

// add nunjucks as view:
app.use(templating('views', {
  noCache: !isProduction,
  watch: !isProduction
}))

// bind .rest() for ctx:
app.use(rest.restify())

// add controller:
app.use(controller())
// db data inject test: (on/off)
// dbInitializer()

app.listen(3000)
console.log('app started at port 3000...')

/* ------------- Functions ------------- */
function parseUser (obj) {
  if (!obj) {
    return
  }
  console.log('try parse: ' + obj)
  let s = ''
  if (typeof obj === 'string') {
    s = obj
  } else if (obj.headers) {
    let cookies = new Cookies(obj, null)
    s = cookies.get('myusername')
  }
  if (s) {
    try {
      let user = JSON.parse(Buffer.from(s, 'base64').toString())
      console.log(`User: ${user.myusername}`)
      return user.myusername
    } catch (e) {
      // ignore
    }
  }
}
