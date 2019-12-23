const router = require('koa-router')()
const code = require('./core/code')

router.get('/api', async (ctx) => {
  ctx.body = 'hello, world'
})

router.post('/api/verifyCode', code.verifyCode)

module.exports = router

