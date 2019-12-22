const wechat = require('co-wechat')
const router = require('koa-joi-router')()

const config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID,
  encodingAESKey: process.env.ENCODING_AES_KEY
}

router.get('/', async (ctx) => {
  ctx.body = 'hello, world'
})

router.get('/wechat', wechat(config).middleware(async (message, ctx) => {
  console.log(message)
}))

module.exports = router

