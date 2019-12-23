require('dotenv').config()

const Koa = require('koa')
const koaBody = require('koa-body')
const wechat = require('co-wechat')
const router = require('./router')
const we = require('./wechat')
const cors = require('@koa/cors');

const app = new Koa()

app.use(cors())
app.use(koaBody({
  jsonLimit: '1kb'
}))

const config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID,
  encodingAESKey: process.env.ENCODING_AES_KEY
}

app.use(router.routes())

// TODO: 挂载到路由 /wechat 之下
app.use(wechat(config).middleware(we))

app.listen(3000)

