const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');
const { ru } = require('date-fns/locale');

// Используем правильный путь внутри контейнера Pterodactyl
const logDir = path.join('/home/container', 'logs');
if (!fs.existsSync(logDir)) {
    try {
        fs.mkdirSync(logDir, { recursive: true });
        console.log(`Директория логов создана: ${logDir}`);
    } catch (err) {
        console.error(`Не удалось создать директорию логов: ${err.message}`);
        // Продолжаем работу без записи в файл
    }
}

const logFile = path.join(logDir, `${format(new Date(), 'yyyy-MM-dd')}.log`);

const logLevels = {
    error: 'ERROR',
    warn: 'WARN',
    info: 'INFO',
    debug: 'DEBUG'
};

const log = (level, message) => {
    const timestamp = format(new Date(), 'HH:mm:ss', { locale: ru });
    const logMessage = `[${timestamp}] [${logLevels[level]}] ${message}`;
    
    console[level](logMessage);
    fs.appendFileSync(logFile, logMessage + '\n');
};

module.exports = {
    error: (message) => log('error', message),
    warn: (message) => log('warn', message),
    info: (message) => log('info', message),
    debug: (message) => log('debug', message)
};