require('dotenv').config()

const Koa = require('koa')
const koaBody = require('koa-body')
const router = require('./router')
const cors = require('@koa/cors');

const app = new Koa()

app.use(cors())
app.use(koaBody({
  jsonLimit: '1kb'
}))


app.use(router.routes())

app.listen(3000)

