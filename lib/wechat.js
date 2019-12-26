const WechatAPI = require('co-wechat-api')
const cache = require('./cache')

const appid = process.env.APP_ID
const secret = process.env.APP_SECRET
const api = new WechatAPI(
  appid,
  secret,
  () => cache.get('ACCESS_TOKEN'),
  (token) => cache.set('ACCESS_TOKEN', token, 1000 * 60 * 110)
)

module.exports = api
