const router = require('koa-router')()
const wechat = require('co-wechat')

const code = require('./ctrl/code')
const we = require('./wechat')

const config = {
  token: process.env.TOKEN,
  appid: process.env.APP_ID,
  encodingAESKey: process.env.ENCODING_AES_KEY
}

router.use('/api', async (ctx, next) => {
  try {
    await next()
    ctx.body = {
      // ctx.body == null 会有问题
      data: ctx.body
    }
  } catch (e) {
    ctx.body = {
      error: e.message || e.name,
      code: e.name
    }
  }
})

router.get('/api', async (ctx) => {
  ctx.body = 'hello, world'
})

router.post('/api/verifyCode', code.verifyCode)
router.post('/api/verifyToken', code.verifyToken)

router.get('/wechat', wechat(config).middleware(we))
router.post('/wechat', wechat(config).middleware(we))

module.exports = router

