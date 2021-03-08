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

const showMainMenu = async (inquirer) => {
    const response = await inquirer.prompt([
        {
            type: "list",
            name: "main_menu",
            prefix: "🤖:",
            message: "¿Que verga deseas hacer?",
            choices: [
                {
                    name: "Consultar saldo",
                    value: 'query_balance'
                },
                new inquirer.Separator(),
                {
                    name: "Cerrar sesión",
                    value: "end_session"
                }
            ],
        },
    ])

    return response["main_menu"]
}

const promptUser = async (inquirer) => await prompt(inquirer, "¿Cual es tu pinche usuario?")
const promptToken = async (inquirer) => await prompt(inquirer, "¿Que pinche token te dio la app?")
const promptPassword = async (inquirer) => await prompt(inquirer, "¿Cúal es tu pinche contraseña?")

module.exports = {
    promptUser,
    promptToken,
    promptPassword,
    showMainMenu
}
