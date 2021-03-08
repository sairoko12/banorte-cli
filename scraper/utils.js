'use strict'

const initializeBrowser = async (puppeteer) => await puppeteer.launch({
    headless: false
})

const createPage = async (browser, pageSettings) => {
    const page = await browser.newPage()

    await page.setViewport(pageSettings['viewPort'])
    await page.setUserAgent(pageSettings['userAgent'])
    await page.setDefaultTimeout(pageSettings['maxTimeOut'])

    return page
}

const pageGoToUrl = async (page, url) => {
    await page.goto(url)
    return page
}

const waitElement = async (page, selector) => await page.waitForSelector(selector)

const takeScreenShot = async (page, description) => await page.screenshot({
    path: `screenshots/step-${description}.jpg`
})

const getTextFromElement = async (page, selector) => {
    const text = await page.$eval(selector, element => element.textContent)
    return text
}

module.exports = {
    initializeBrowser,
    createPage,
    pageGoToUrl,
    waitElement,
    takeScreenShot,
    getTextFromElement
}
