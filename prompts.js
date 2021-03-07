'use strict'

const {
    logWarning
} = require('./utils')

const prompt = async (inquirer, question) => {
    const response = await inquirer.prompt({
        type: 'password',
        name: 'userInput',
        mask: '*',
        message: question,
        prefix: "🤖:"
    })

    return response.userInput
}

const promptUser = async (inquirer) => await prompt(inquirer, "¿Cual es tu pinche usuario?")
const promptToken = async (inquirer) => await prompt(inquirer, "¿Que pinche token te dio la app?")
const promptPassword = async (inquirer) => await prompt(inquirer, "¿Cúal es tu pinche contraseña?")

module.exports = {
    promptUser,
    promptToken,
    promptPassword
}
