const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

module.exports = async (client) => {
    try {
        const eventsPath = path.join(__dirname, '../../events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }

            logger.info(`✅ Событие ${event.name} загружено`);
        }
    } catch (error) {
        logger.error(`❌ Ошибка загрузки событий: ${error}`);
    }
};