const issue = require('../utils/issue')

exports.random = async function (ctx) {
  const issues = issue.randomIssues(10)
  ctx.body = issues
}
