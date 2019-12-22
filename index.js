require('dotenv').config()

const Koa = require('koa')
const router = require('./router')
const app = new Koa()

app.use(router.middleware())

app.listen(3000)
