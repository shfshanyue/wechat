const LRU = require('lru-cache')
const cache = new LRU({
  max: 5000000,
  length: function (n, key) {
    return n.length
  },
  maxAge: 1000 * 60 * 60 
})

module.exports = cache
