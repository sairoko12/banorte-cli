'use strict'

const { exec } = require('child_process')

const logError = (chalk, message) => {
    console.log(chalk.red(message))
}

const logSuccess = (chalk, message) => {
    console.log(chalk.green(message))
}

const logWarning = (chalk, message) => {
    console.log(chalk.yellow(message))
}

const printToken = (chalk, token) => {
    logSuccess(chalk, `🤖: Ten el pinche código para generar el token "${chalk.underline.bgRed.black(token)}" metelo en la app`)
}

const clearScreenshots = async () => await exec('rm -rf screenshots/*.jpg')

const startLoader = loading => {
    return loading("Estoy haciendo mágia prro! 🔮").start()
}

module.exports = {
    logError,
    logSuccess,
    logWarning,
    printToken,
    clearScreenshots,
    startLoader
}
