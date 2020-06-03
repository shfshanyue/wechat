const axios = require('axios')

const url = 'https://bing.ioliu.cn/v1/rand?type=json'

function getWallpaper () {
  return axios.get(url).then(({ data: { data }}) => data)
}

module.exports = {
  getWallpaper
}

