const {
    logWarning
} = require('../utils')

const {
    waitElement,
    takeScreenShot,
    getTextFromElement
} = require('./utils')

const queryBalance = async (page, chalk, settings) => {
    logWarning(chalk, "Consultando balance")
}

const closeSession = async (page, chalk, settings) => {
    try {
        await waitElement(page, settings["logoutButtonSelector"])
        await page.click(settings["logoutButtonSelector"])
    } catch (e) {
        await takeScreenShot(page, "logout")
        throw new Error("🤖: No pude cerrar la sesión we")
    }
}

module.exports = {
    queryBalance,
    closeSession
}
