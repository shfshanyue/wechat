const Joi = require('@hapi/joi')
const issue = require('../service/issue')

exports.issues = async function (ctx) {
  const { ids } = Joi.attempt(ctx.request.query, Joi.object({
    ids: Joi.string().default('')
  }))
  ctx.body = ids.split(',').map(id => issue.getIssueById(id))
}

exports.random = async function (ctx) {
  const issues = issue.randomIssues(8)
  ctx.body = issues
}
