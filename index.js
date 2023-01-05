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
    closeSession,
    getLastLoginDate,
    solveCaptcha
} = require('./scraper')

const {
    promptUser,
    promptToken,
    promptPassword,
    showMainMenu
} = require('./prompts')

const {
    logWarning,
    logSuccess,
    printToken,
    clearScreenshots,
    startLoader
} = require('./utils')

const createDependencies = async () => {
    return {
        "puppeteer": require('puppeteer-extra'),
        "chalk": require('chalk'),
        "inquirer": require('inquirer'),
        "loading": require('loading-cli'),
        "recaptcha": require('puppeteer-extra-plugin-recaptcha'),
        "stealth": require('puppeteer-extra-plugin-stealth')
    }
}


const {
    Logger
} = require('./logger');


(async () => {
    await clearScreenshots()

    const dependecies = await createDependencies()
    const browser = await initializeBrowser(
        dependecies["puppeteer"],
        dependecies["recaptcha"],
        dependecies["stealth"],
        settings["browserSettings"],
        settings["captchaSettings"]
    )
    const logger = new Logger(dependecies['chalk'])

    logger.success("Welcome to BANORTE CLI - 🤖")

    const user = await promptUser(dependecies["inquirer"])
    const password = await promptPassword(dependecies["inquirer"])

    logger.warning("🤖: No la compartas con nadie bb, sólo conmigo 😘")

    let loader = startLoader(dependecies["loading"])

    const pageSettings = {
        ...settings["page"]
    }

    const newPage = await createPage(browser, pageSettings)
    const startPage = await pageGoToUrl(newPage, settings["urls"]["start"])

    try {
        const closeModalIfExists = await validatePoupWindow(
            startPage,
            settings["modalSelector"],
            settings["closeSelector"],
            dependecies['chalk']
        )

        const passwordPage = await putUserName(closeModalIfExists, user, settings["userSelector"], settings["userSubmitSelector"])
        const userMaskName = await getHiddenName(passwordPage, settings["hiddenNameSelector"])
        const token = await getToken(passwordPage, settings["passwordSelector"], userMaskName)

        loader.stop()

        printToken(logger, token, userMaskName)

        const userToken = await promptToken(dependecies["inquirer"])
        loader = startLoader(dependecies["loading"])
        const accessPage = await putPasswordAndToken(
            passwordPage,
            password,
            userToken,
            settings["passwordLoginSelector"],
            settings["tokenLoginSelector"],
            settings["submitPasswordSelector"]
        )

        const solvedCaptchaPage = await solveCaptcha(accessPage, settings["submitPasswordSelector"])

        const hasLoginError = await validatePasswordError(solvedCaptchaPage, settings["sessionErrorSelector"])

        const accountsPage = await waitMainView(solvedCaptchaPage, settings["accountsViewSelector"])
        const lastLoginDate = await getLastLoginDate(accountsPage, settings["lastLoginSelector"])

        loader.stop()

        if (!lastLoginDate) {
            throw new Error("No se completo el login")
        }

        let userOption = null
        let action = null

        logger.success("🤖: Sesión iniciada correctamente")
        logger.warning(`🤖: Tu último login fue: ${lastLoginDate}`)

        while(userOption != "end_session") {
            userOption = await showMainMenu(dependecies['inquirer'])
            loader = startLoader(dependecies['loading'])
            action = userActionsMapping[userOption]

            await action(accountsPage, dependecies['chalk'], settings)

            loader.stop()
        }

        await closeSession(accountsPage, settings)

        logger.success("🤖: Adiós popo, ya cerre tu sesión!")
    } catch (error) {
        console.log(error)
        loader.stop()
        logger.error(`🤖: Ocurrió un error bastardo, y dice así: ${error.message}`)
    }

    // await browser.close()
})();
