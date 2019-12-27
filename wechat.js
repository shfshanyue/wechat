// 处理微信逻辑，自动回复微信消息

const _ = require('lodash')
const cache = require('./lib/cache')

function handleCode (message) {
  const { FromUserName: from, Content: code } = message
  // 对于 code，存储三分钟
  cache.set(code, from, 3 * 60 * 1000)
  return '您好，在三分钟内刷新网站即可无限制浏览所有文章'
}

function handleReplyWechat () {
  
}

function handleSubscribe () {
  const message = `欢迎关注公众号 【全栈成长之路】
我是山月，你可以添加我的微信号 shanyue94，另欢迎关注我的系列文章

1. 当我有一台服务器时，我做了什么 https://shanyue.tech/op/ (即将全部转入公众号)
2. 全栈之路，日进一卒 https://q.shanyue.tech/ (公众号将精选问题写入文章)
3. 使用 GraphQL 构建 web 应用 https://github.com/shfshanyue/graphql-guide
4. kubernetes 与 微服务实践 https://github.com/shfshanyue/learn-k8s
5. Serverless与微信开发 
`
  return message
}

const routes = [{
  text: /\d{4}/,
  handle: handleCode
}, {
  text: /微信/,
  handle: handleReplyWechat
}, {
  event: 'subscribe',
  handle: handleSubscribe
}]

module.exports = (message, ctx) => {
  // 使用 winston 替代，如果用户多了
  console.log(message)
  const { MsgType: type, Content: content, Event: event } = message
  const types = ['text', 'voice', 'image', 'event']

  // 路由可缓存
  const groupRoutes = _.groupBy(
    // 添加 type
    routes.map(route => {
      const keys = Object.keys(route)
      const type = types.find(type => keys.includes(type))
      return {
        type,
        ...route
      }
    }),
    'type'
  )

  let matchRoute
  if (type === 'text') {
    matchRoute = groupRoutes.text.find(
      route => route.text.test(content)
    )
  } else if (type === 'event') {
    // find 效率较低
    matchRoute = groupRoutes.event.find(
      route => route.event === event
    )
  }

  if (matchRoute) {
    return matchRoute.handle(message, ctx)
  }
  return '欢迎关注公众号 · 全栈成长之路'
}
