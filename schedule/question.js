const wechat = require('../lib/wechat')

// api.getMaterials('news', 0, 2).then(o => {
  // console.log(JSON.parse(o.toString()).item.map(x => x.content.news_item[0]))
// })

wechat.uploadThumbMaterial('./git.jpeg', 'hello, world').then(o => {
  console.log(o.toString())
})

wechat.uploadNewsMaterial({
  "articles": [
    {
      thumb_media_id: 'yspyRwTb0m9UyK78TLER8AuE9D2owwW1bWzCmdx65rM',
      "title": "hello, world",
      "author": "shanyue",
      "show_cover_pic": 1,
      "content": html,
      "content_source_url": "https://www.baidu.com"
    },
    //若新增的是多图文素材，则此处应还有几段articles结构
  ]
}).then(o => {
  const b = Buffer.from('hello, world')
  console.log(b.toString())
  console.log('upload', o.toString())
})