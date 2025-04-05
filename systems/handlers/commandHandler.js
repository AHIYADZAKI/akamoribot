const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

module.exports = async (client) => {
    try {
        const commandsPath = path.join(__dirname, '../../commands');
        const commandFolders = fs.readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(folderPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    logger.info(`✅ Команда ${command.data.name} загружена`);
                } else {
                    logger.warn(`⚠️ Команда в ${filePath} отсутствует требуемое свойство "data" или "execute"`);
                }
            }
        }
    } catch (error) {
        logger.error(`❌ Ошибка загрузки команд: ${error}`);
    }
};