require('dotenv').config()

const Koa = require('koa')
const wechat = require('co-wechat')
const router = require('./router')
const we = require('./core/we')
const app = new Koa()

const config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID,
  encodingAESKey: process.env.ENCODING_AES_KEY
}

app.use(router.routes())
app.use(wechat(config).middleware(we))

app.listen(3000)

