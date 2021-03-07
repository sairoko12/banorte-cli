'use strict'

require('dotenv').config()

module.exports = {
    userSelector: "#userid",
    userSubmitSelector: "#btn_lgn_entrar",
    hiddenNameSelector: "#nombreEnmascarado",
    passwordSelector: "#mensajeTokenCelular",
    passwordLoginSelector: "#passwordLogin",
    tokenLoginSelector: "#tokenLogin",
    submitPasswordSelector: "#btnAceptarloginPasswordAsync",
    page: {
        viewPort: {
            width: 1920,
            height: 1080
        },
        maxTimeOut: 8500,
        userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    },
    urls: {
        start: process.env.BANORTE_ROOT_URL
    }
}
