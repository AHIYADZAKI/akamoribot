module.exports = {
    // Проверка на URL
    isURL: (str) => {
        const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return pattern.test(str);
    },

    // Проверка на email
    isEmail: (str) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(str);
    },

    // Проверка на ID Discord (число)
    isSnowflake: (str) => {
        const pattern = /^\d{17,19}$/;
        return pattern.test(str);
    },

    // Извлечение ID из упоминания
    extractID: (mention) => {
        const pattern = /^<@!?(\d+)>$/;
        const match = mention.match(pattern);
        return match ? match[1] : null;
    },

    // Удаление упоминаний из текста
    cleanMentions: (text) => {
        return text.replace(/<@!?\d+>/g, '').trim();
    }
};