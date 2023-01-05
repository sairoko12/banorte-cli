'use strict'

const { exec } = require('child_process')


const printToken = (logger, token, userName) => {
    logger.success(`🤖: Hola ${userName}, ingresa este TOKEN "${logger.chalk.underline.bgRed.black(token)}" en la aplicación de Banorte.`)
}

const clearScreenshots = async () => await exec('rm -rf screenshots/*.jpg')

const startLoader = loading => {
    return loading("Estoy haciendo mágia prro! 🔮").start()
}

module.exports = {
    printToken,
    clearScreenshots,
    startLoader
}
