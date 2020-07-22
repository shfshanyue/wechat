// 处理微信逻辑，自动回复微信消息

const _ = require('lodash')
const cache = require('./lib/cache')

// 关注后回复
function handleSubscribe () {
  const message = `终于等到你，恭喜你离突破自我又近了一步，这里汇集着前端，后端及 DevOps 的全链路式优秀文章。

并在每晚 10: 24 准时推送

--------
<a href="https://shanyue.tech">山月博客</a>
<a href="https://q.shanyue.tech">每日一题</a>

回复【加群】，与众多开发者交流
回复【微信】，与我交流产品技术
`
  return message
}

// 自动回复
function handleDefault () {
  const message = 
`回复【加群】，与众多开发者交流
回复【微信】，与我交流产品技术
`
  return message
}

function handleCode (message) {
  const { FromUserName: from, Content: code } = message
  // 对于 code，存储三分钟
  cache.set(code, from, 365 * 24 * 60 * 60 * 1000)
  return '您好，在三分钟内刷新网站即可无限制浏览所有文章'
}

async function handleReplyWechat () {
  // const materials = await api.getMaterials('image', 0, 2)
  // console.log(JSON.parse(materials.toString()))
  // 硬编码，不太好...
  return {
    type: 'image',
    content: {
      mediaId: 'Gtdxee7ZsbxB6kkbVpNuJfkmgmyGLMRN--W5mwbBYlg'
    }
  }
}

const routes = [{
  default: true,
  handle: handleDefault
}, {
  text: /\d{4}/,
  handle: handleCode
}, {
  text: /红包/,
  handle () {
    return '<a data-miniprogram-appid="wx558e4cb3c26e6076" data-miniprogram-path="/pages/lottery/detail.html?id=xjjp4oka5lk7so6d8" href=" ">点我参与抽奖！</a>'
  }
}, {
  text: /微信|加群/,
  handle: handleReplyWechat
}, {
  event: 'subscribe',
  handle: handleSubscribe
}]

// 路由控制函数，黑盒子，可忽略
module.exports = (message, ctx) => {
  // 使用 winston 替代，如果用户多了
  console.log(message)
  const { MsgType: type, Content: content, Event: event } = message
  const types = ['text', 'voice', 'image', 'event', 'default']

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
  matchRoute = matchRoute || _.get(groupRoutes, ['default', 0])
  if (matchRoute) {
    return matchRoute.handle(message, ctx)
  }
  return '欢迎关注公众号 · 全栈成长之路'
}
