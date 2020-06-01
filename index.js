require('dotenv').config()

const Koa = require('koa')
const koaBody = require('koa-body')
const router = require('./router')
const cors = require('@koa/cors')

const app = new Koa()

app.use(async (ctx, next) => {
  await next()
  console.log(ctx.request.method, ctx.url, ctx.body, ctx.request.body)
})


app.use(cors())
app.use(koaBody({
  jsonLimit: '1kb'
}))

app.use(router.routes())

app.listen(3000)

require('./lib/wechat')

