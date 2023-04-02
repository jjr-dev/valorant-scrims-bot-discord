const cron = require('node-cron')

const AutoUpdateLinkAccount = require('./src/helpers/AutoUpdateLinkAccount')

async function cronjobs(client) {
    cron.schedule('*/5 * * * *', () => {
        AutoUpdateLinkAccount(client);
    })
}

module.exports = cronjobs;