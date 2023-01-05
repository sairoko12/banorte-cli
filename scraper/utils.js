'use strict'

const userAgent = require('user-agents')
const { executablePath } = require('puppeteer')

const initializeBrowser = async (puppeteer, recaptchaPlugin, stealth, browserSettings, captchaSettings) => {
    puppeteer.use(stealth())
    puppeteer.use(
        recaptchaPlugin({
            provider: { id: captchaSettings["captchaProvider"], token: captchaSettings["captchaToken"] },
            visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
        })
    )

    return await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: browserSettings["headless"],
        executablePath: executablePath(),
    })
}

const createPage = async (browser, pageSettings) => {
    const page = await browser.newPage()
    const userAgentToUse = userAgent.random().toString()

    await page.setViewport(pageSettings['viewPort'])
    await page.setUserAgent(userAgentToUse)
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
    const text = await page.$eval(selector, element => element.textContent.trim())
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
