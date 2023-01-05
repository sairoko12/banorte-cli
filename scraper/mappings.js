const {
    queryBalance,
    closeSession,
    queryAccounts
} = require('./actions')

const userActionsMapping = {
    query_balance: queryBalance,
    query_accounts: queryAccounts,
    end_session: closeSession,
}

module.exports = {
    userActionsMapping
}
