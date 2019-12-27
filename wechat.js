// 处理微信逻辑，自动回复微信消息

const _ = require('lodash')
const cache = require('./lib/cache')
const api = require('./lib/wechat')

// 关注后回复
function handleSubscribe () {
  const message = `终于等到你，你离突破自我又近了一步
这里除了技术文章外，也有一些新人成长，自由职业，产品思考以及天上星陌边花的有趣文章，欢迎交流

--------

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
回复【面试】，将有大厂模拟面试
回复【面试】，将有大厂模拟面试
`
  return message
}

function handleCode (message) {
  const { FromUserName: from, Content: code } = message
  // 对于 code，存储三分钟
  cache.set(code, from, 3 * 60 * 1000)
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

function handleInterview () {
  return `
`
}

const routes = [{
  default: true,
  handle: handleDefault
}, {
  text: /\d{4}/,
  handle: handleCode
}, {
  text: /面试/,
  handle: handleInterview,
}, {
  text: /微信|加群/,
  handle: handleReplyWechat
}, {
  event: 'subscribe',
  handle: handleSubscribe
}]

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
