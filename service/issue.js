const _ = require('lodash')
const issues = require('../issues.json')

const issuesById = _.keyBy(issues, 'number')
const flatIssues = _.flatMap(issues, issue => _.map(issue.labels, label => _.omit({ ...issue, label }, '')))
const issuesByLabel = _.groupBy(flatIssues, 'label.name')
const issuesByGroup = _.groupBy(flatIssues, 'label.group')

function getIssueById (id) {
  return _.get(issuesById, id, {})
}

// group: 只提供 fe/server
function randomIssues (n = 9, group = 'fe') {
  const issues = group ? _.get(issuesByGroup, group, []) : issues
  const targetIssues = Array.from({ length: n }, x => _.sample(issues))
  return _.uniqBy(targetIssues, 'number')
}

module.exports = {
  randomIssues,
  getIssueById,
  issues
}