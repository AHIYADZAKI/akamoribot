const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

module.exports = async (client) => {
    try {
        const buttonsPath = path.join(__dirname, '../buttons');
        const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

        for (const file of buttonFiles) {
            const filePath = path.join(buttonsPath, file);
            const button = require(filePath);

            if ('customId' in button && 'execute' in button) {
                client.buttons.set(button.customId, button);
                logger.info(`✅ Кнопка ${button.customId} загружена`);
            } else {
                logger.warn(`⚠️ Кнопка в ${filePath} отсутствует требуемое свойство "customId" или "execute"`);
            }
        }
    } catch (error) {
        logger.error(`❌ Ошибка загрузки кнопок: ${error}`);
    }
};