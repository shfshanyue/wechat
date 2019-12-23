// 处理微信逻辑，自动回复微信消息

const cache = require('./cache')

function handleCode (message) {
  const { FromUserName: from, Content: code } = message
  // 对于 code，存储三分钟
  cache.set(code, from, 3 * 60 * 1000)
  return '您好，在三分钟内刷新网站即可无限制浏览所有文章'
}

module.exports = (message, ctx) => {
  const { MsgType: type, Content: content } = message
  if (type === 'text') {
    // 如果是四位数字解锁码：9810
    if (/\d{4}/.test(content)) {
      return handleCode(message)
    }
  }
  return '欢迎关注公众号 · 全栈成长之路'
}
