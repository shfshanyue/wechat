const puppeteer = require('puppeteer-core')
const { sleep } = require('../util')

function getBrowser () {
  return puppeteer.connect({ browserWSEndpoint: 'wss://chrome.shanyue.tech' })
}

async function getHtmlFromMd (content) {
  const browser = await getBrowser()

  try {
    const context = browser.defaultBrowserContext()
    context.overridePermissions('https://mdnice.com', ['clipboard-read'])
    const page = await browser.newPage()
    await page.goto('https://mdnice.com', {
      timeout: 90000,
      waitUntil: 'networkidle0'
    });

    // 配置 markdon，theme 及 code theme
    await page.evaluate((content) => {
      function setTheme (localStorage, name = '蔷薇紫') {
        const themeList = JSON.parse(localStorage.theme_list)
        const theme = themeList.find(x => x.name === name)
        localStorage.style = theme.css
        localStorage.template_num = theme.themeId
        localStorage.code_num = 1
      }

      localStorage.content = content
      setTheme(localStorage)
    }, content);

    await page.reload({
      timeout: 90000,
      waitUntil: 'networkidle0'
    })

    // 添加微信外链脚注
    await page.evaluate(() => {
      document.getElementById('nice-menu-link-to-foot').click()
    })
    // 复制微信内容
    await page.click('#nice-sidebar-wechat')

    // 读取剪贴板内容
    const html = await page.evaluate(() => {
      return navigator.clipboard.readText()
        .catch(err => {
          return null
        })
    })
    return html
  } catch (e) {
    console.error(e)
  } finally {
    await browser.close()
  }
}

module.exports = {
  getHtmlFromMd
}
