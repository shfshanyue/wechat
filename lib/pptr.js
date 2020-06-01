const puppeteer = require('puppeteer-core');

function getBrowser () {
  return puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io' })
}

function getHtmlFromMd (content) {
  const browser = await getBrowser()

  try {
    const context = browser.defaultBrowserContext()
    context.overridePermissions('https://mdnice.com', ['clipboard-read'])
    const page = await browser.newPage()
    await page.goto('https://mdnice.com', {
      timeout: 60000,
      waitUntil: 'networkidle0'
    });
    await page.evaluate(() => {
      localStorage.content = content
    });
    await page.reload({
      timeout: 60000,
      waitUntil: 'networkidle0'
    })
    await page.evaluate(() => {
      document.getElementById('nice-menu-link-to-foot').click()
    })
    await page.click('#nice-sidebar-wechat')
    const content = await page.evaluate(() => {
      return navigator.clipboard.readText()
        .catch(err => {
          return null
        })
    })
  } catch (e) {
    console.error(e)
  } finally {
    await browser.close()
  }
}

module.exports = getHtmlFromMd