function sleep (n) {
  return new Promise(resolve => setTimeout(resolve, n * 1000))
}

exports.sleep = sleep
