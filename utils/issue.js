const _ = require('lodash')
const issues = require('../issues.json')

const issuesById = _.keyBy(issues, 'number')
const flatIssues = _.flatMap(issues, issue => _.map(issue.labels, label => _.omit({ ...issue, label }, '')))
const issuesByLabel = _.groupBy(flatIssues, 'label.name')
const issuesByGroup = _.groupBy(flatIssues, 'label.group')

function random (list) {
  return _.get(list, _.random(list.length - 1))
}

// group: 只提供 fe/server
function randomIssues (n = 9, group = 'fe') {
  const issues = _.get(issuesByGroup, group, [])
  const groupIssues = Array.from(Array(n - 2), x => random(issues))
  const devOpsIssues = random(issuesByLabel['docker'])
  const httpIssues = random(issuesByLabel['http'])
  return _.uniqBy([...groupIssues, devOpsIssues, httpIssues], 'number')
}

module.exports = {
  randomIssues
}