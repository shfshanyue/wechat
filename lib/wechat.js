const WechatAPI = require('co-wechat-api')
const cache = require('./cache')

const api = new WechatAPI(
  process.env.APP_ID,
  process.env.APP_SECRET,
  () => cache.get('ACCESS_TOKEN'),
  (token) => cache.set('ACCESS_TOKEN', token, 1000 * 60 * 110)
)


module.exports = api
