const router = require('koa-router')()
const code = require('./ctrl/code')
const issue = require('./ctrl/issue')

router.use(async (ctx, next) => {
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

router.get('/api/issues', issue.issues)
router.get('/api/issues/random', issue.random)

module.exports = router

