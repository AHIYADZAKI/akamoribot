const logger = require('../../utils/logger');

module.exports = (client) => {
    process.on('unhandledRejection', error => {
        logger.error(`⚠️ Необработанное исключение (unhandledRejection): ${error}`);
        if (error.stack) logger.error(error.stack);
    });

    process.on('uncaughtException', error => {
        logger.error(`⚠️ Непойманное исключение (uncaughtException): ${error}`);
        if (error.stack) logger.error(error.stack);
    });

    client.on('error', error => {
        logger.error(`⚠️ Ошибка Discord.js: ${error}`);
    });

    client.on('warn', warning => {
        logger.warn(`⚠️ Предупреждение Discord.js: ${warning}`);
    });

    client.on('debug', info => {
        logger.debug(`ℹ️ Отладка Discord.js: ${info}`);
    });
};