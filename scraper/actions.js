const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')

const {
    logWarning
} = require('../utils')

const {
    waitElement,
    takeScreenShot,
    getTextFromElement,
} = require('./utils')


const queryBalance = async (page, logger, settings) => {
    logger.warning(chalk, "Consultando balance")
}

const queryAccounts = async (page, accountsSelector) => {

}

const closeSession = async (page, settings) => {
    try {
        await waitElement(page, settings["logoutButtonSelector"])
        await page.click(settings["logoutButtonSelector"])
    } catch (e) {
        await takeScreenShot(page, "logout")
        throw new Error("🤖: No pude cerrar la sesión goe")
    }
}


const solveCaptcha = async (page, submitPasswordSelector) => {
    try {
        await page.waitForFunction(() => {
            const iframe = document.querySelector('iframe[src*="api2/anchor"]')
            if (!iframe) return false

            return !!iframe.contentWindow.document.querySelector('#recaptcha-anchor')
        })

        let frames = await page.frames()
        const recaptchaFrame = frames.find(frame => frame.url().includes('api2/anchor'))
        const checkbox = await recaptchaFrame.$('#recaptcha-anchor')
        await checkbox.click({ delay: rdn(30, 150) })

        await page.waitForFunction(() => {
            const iframe = document.querySelector('iframe[src*="api2/bframe"]')
            if (!iframe) return false

            const img = iframe.contentWindow.document.querySelector('.rc-image-tile-wrapper img')
            return img && img.complete
        })

        await takeScreenShot(page, "si-ca")
        const { captchas, solutions, solved, error } = await page.solveRecaptchas()

        console.log("QUE PASA!")
        console.log(captchas)
        console.log(solutions)
        console.log(solved)
        console.log(error)

        await Promise.all([
            page.waitForNavigation(),
            page.click(submitPasswordSelector)
        ])
    } catch (e) {
        await takeScreenShot(page, "no-ca")
    }

    return page
}

module.exports = {
    queryBalance,
    closeSession,
    queryAccounts,
    solveCaptcha
}
