const Joi = require('@hapi/joi')
const cache = require('../lib/cache')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

exports.verifyCode = async function (ctx) {
  const { code } = Joi.attempt(ctx.request.body, Joi.object({
    code: Joi.string().pattern(/\d{4}/)
  }))
  if (!cache.get(code)) {
    ctx.body = ''
    return
  }
  const from = cache.get(code)
  ctx.body = jwt.sign({ from }, secret, { expiresIn: '3y' })
}

exports.verifyToken = async function (ctx) {
  const { token } = Joi.attempt(ctx.request.body, Joi.object({
    token: Joi.string().required()
  }))
  ctx.body = jwt.verify(token, secret)
}
