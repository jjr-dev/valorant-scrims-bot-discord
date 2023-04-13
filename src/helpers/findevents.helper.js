const fs = require('node:fs');
const path = require('node:path');

module.exports = () => {
    const events = [];

    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for(const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        events.push(event);
    }

    return events;
}