const _ = require('lodash')
const wechat = require('../lib/wechat')
const { getHtmlFromMd } = require('../lib/pptr')
const { randomIssues } = require('../service/issue')

const thumbImageMadias = [
  // 'yspyRwTb0m9UyK78TLER8NedJiQiztrAJjQib6iC83s',
  // 'yspyRwTb0m9UyK78TLER8AuE9D2owwW1bWzCmdx65rM',
  // 'yspyRwTb0m9UyK78TLER8EZVxoeycEXFfCAdJR6q2nQ',
  // 'yspyRwTb0m9UyK78TLER8JCBaGa2ukd0NiQ8i3uHM_E'
  'yspyRwTb0m9UyK78TLER8E_wdRSWjp6KJF8d2p_vVP4'
]

async function uploadIssue () {
  const issues = await randomIssues(20)
  const issue = issues.find(i => i.comment)
  const answer = issue.comment.body
  const content = await getHtmlFromMd(answer)
  console.log(issue.number, 'done', answer, content)
  const result = await wechat.uploadNewsMaterial({
    articles: [
      {
        thumb_media_id: _.sample(thumbImageMadias),
        title: issue.title.slice(6),
        author: issue.comment.author.login,
        show_cover_pic: 0,
        content,
        content_source_url: `https://github.com/shfshanyue/Daily-Question/issues/${issue.number}`
      },
      //若新增的是多图文素材，则此处应还有几段articles结构
    ]
  })
  console.log(JSON.parse(result.toString()))
}

uploadIssue()

// schedule.scheduleJob('', async () => {
// })

// wechat.uploadThumbMaterial('./assets/born.jpeg', 'git').then(o => {
//   console.log(o.toString())
// })
