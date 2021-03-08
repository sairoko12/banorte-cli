'use strict'

const settings = require('./settings')
const {
    initializeBrowser,
    createPage,
    pageGoToUrl,
    putUserName,
    getHiddenName,
    getToken,
    putPasswordAndToken,
    validatePasswordError,
    validatePoupWindow,
    waitMainView,
    userActionsMapping,
    closeSession
} = require('./scraper')

const {
    promptUser,
    promptToken,
    promptPassword,
    showMainMenu
} = require('./prompts')

const {
    logError,
    logWarning,
    logSuccess,
    printToken,
    clearScreenshots,
    startLoader
} = require('./utils')

const createDependencies = async () => {
    return {
        'puppeteer': require('puppeteer'),
        'chalk': require('chalk'),
        'inquirer': require('inquirer'),
        'loading': require('loading-cli')
    }
}

(async () => {
    await clearScreenshots()

    const dependecies = await createDependencies()
    const browser = await initializeBrowser(dependecies['puppeteer'])

    logSuccess(dependecies['chalk'], "Welcome to BANORTE CLI - 🤖")

    const user = await promptUser(dependecies['inquirer'])
    const password = await promptPassword(dependecies['inquirer'])

    logWarning(dependecies['chalk'], "🤖: No la compartas con nadie bb, sólo conmigo 😘")

    let loader = startLoader(dependecies['loading'])
    const newPage = await createPage(browser, settings['page'])
    const startPage = await pageGoToUrl(newPage, settings['urls']['start'])

    try {
        const passwordPage = await putUserName(startPage, user, settings["userSelector"], settings["userSubmitSelector"])
        const userMaskName = await getHiddenName(passwordPage, settings["hiddenNameSelector"])
        const token = await getToken(passwordPage, settings["passwordSelector"], userMaskName)

        loader.stop()

        printToken(dependecies['chalk'], token)

        const userToken = await promptToken(dependecies["inquirer"])
        const accessPage = await putPasswordAndToken(
            passwordPage,
            password,
            userToken,
            settings["passwordLoginSelector"],
            settings["tokenLoginSelector"],
            settings["submitPasswordSelector"]
        )

        const hasLoginError = await validatePasswordError(accessPage, settings["sessionErrorSelector"])

        console.log(hasLoginError)

        const closeModalIfExists = await validatePoupWindow(accessPage, settings["modalSelector"], settings["closeSelector"], dependecies['chalk'])
        const accountsPage = await waitMainView(closeModalIfExists, settings["accountsViewSelector"])
        let userOption = null
        let action = null

        logSuccess(dependecies['chalk'], "🤖: Sesión iniciada correctamente")

        while(userOption != "end_session") {
            userOption = await showMainMenu(dependecies['inquirer'])
            loader = startLoader(dependecies['loading'])
            action = userActionsMapping[userOption]

            await action(accountsPage, dependecies['chalk'], settings)

            loader.stop()
        }

        logSuccess(dependecies['chalk'], "🤖: Adiós popo, ya cerre tu sesión!")
    } catch (error) {
        loader.stop()
        logError(dependecies['chalk'], `🤖: Ocurrió un error bastardo, y dice así: ${error.message}`)
    }

    await browser.close()
})();
