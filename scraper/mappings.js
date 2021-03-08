const {
    queryBalance,
    closeSession
} = require('./actions')

const userActionsMapping = {
    query_balance: queryBalance,
    end_session: closeSession
}

module.exports = {
    userActionsMapping
}
