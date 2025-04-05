const ms = require('ms');

module.exports = {
    // Форматирование даты в Discord timestamp
    formatDate: (date) => {
        return `<t:${Math.floor(date.getTime() / 1000)}:F>`;
    },

    // Форматирование длительности
    formatDuration: (duration) => {
        if (typeof duration === 'string') {
            duration = ms(duration);
        }
        
        const seconds = Math.floor((duration / 1000) % 60);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));

        let result = '';
        if (days > 0) result += `${days}д `;
        if (hours > 0) result += `${hours}ч `;
        if (minutes > 0) result += `${minutes}м `;
        if (seconds > 0) result += `${seconds}с`;

        return result.trim() || '0с';
    },

    // Парсинг времени из строки
    parseTime: (timeStr) => {
        try {
            return ms(timeStr);
        } catch {
            return null;
        }
    },

    // Получение текущего времени в формате HH:MM:SS
    getCurrentTime: () => {
        const date = new Date();
        return date.toLocaleTimeString('ru-RU');
    }
};