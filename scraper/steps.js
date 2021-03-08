'use strict'

const {
    waitElement,
    takeScreenShot,
    getTextFromElement
} = require('./utils')

const {
    logWarning
} = require('../utils')

const putUserName = async (page, userName, userSelector, userSubmitSelector) => {
    try {
        await waitElement(page, userSelector)
        await page.type(userSelector, userName)
        await page.click(userSubmitSelector)
        return page
    } catch (error) {
        await takeScreenShot(page, 'put-user')
        throw new TypeError("🤖: No se pinches pudo ingresar el usuario")
    }
}

const getHiddenName = async (page, hiddenNameSelector) => {
    try {
        await waitElement(page, hiddenNameSelector)
        const hiddenName = await getTextFromElement(page, hiddenNameSelector)
        return hiddenName
    } catch (error) {
        await takeScreenShot(page, "get-hidden-name")
        throw new TypeError("Tu pinche usuario es invalido 🤡")
    }
}

const getToken = async (page, tokenSelector, userName) => {
    try {
        await waitElement(page, tokenSelector)
        const token = await getTextFromElement(page, tokenSelector)

        if (!token) {
            throw new TypeError(`🤖: Estoy casi seguro que tu usuario (${userName}) es falso!`)
        }

        return token
    } catch (error) {
        await takeScreenShot(page, 'get-token')
        throw new ReferenceError(`No se pinches pudo obtener el token de (${userName}), revisa tu perra información.`)
    }
}

const putPasswordAndToken = async (page, password, token, passwordLoginSelector, tokenLoginSelector, submitPasswordSelector) => {
    await waitElement(page, submitPasswordSelector)

    try {
        await page.type(passwordLoginSelector, password)
        await page.type(tokenLoginSelector, token)
        await page.click(submitPasswordSelector)

        return page
    } catch (error) {
        await takeScreenShot(page, 'put-token-and-password')
        throw new TypeError("La cagaste con el password o el token 🥲")
    }
}

const validatePasswordError = async (page, sessionErrorSelector) => {
    try {
        await page.waitForSelector(sessionErrorSelector, {
            visible: true
        })

        const message = await getTextFromElement(page, `${sessionErrorSelector} > div.boxed > div.content > p`)

        return message
    } catch(error) {
        return false
    }
}

const validatePoupWindow = async (page, modalSelector, closeSelector, chalk) => {
    try {
        await page.waitForSelector(modalSelector, {
            visible: true
        })

        await page.waitForSelector(closeSelector, {
            visible: true
        })

        await page.click(closeSelector)
    } catch (error) {
        return page
    }

    return page
}

const waitMainView = async (page, accountsViewSelector) => {
    try {
        await page.waitForSelector(accountsViewSelector, {
            visible: true
        })
    } catch (error) {
        await takeScreenShot(page, 'load-accounts-view')
        throw new Error("No se ha podido cargar tus pinches cuentas 🥲")
    }
}

module.exports = {
    putUserName,
    getHiddenName,
    getToken,
    putPasswordAndToken,
    validatePasswordError,
    validatePoupWindow,
    waitMainView
}
