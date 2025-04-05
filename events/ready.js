const { ActivityType } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            // Устанавливаем статус бота
            client.user.setPresence({
                activities: [{
                    name: config.bot.status,
                    type: ActivityType.Watching
                }],
                status: 'online'
            });

            console.log(`✅ Бот ${client.user.tag} успешно запущен!`);
            console.log(`🛠️ Серверов: ${client.guilds.cache.size}`);
            console.log(`👥 Пользователей: ${client.users.cache.size}`);
            console.log(`📚 Команд: ${client.commands.size}`);
        } catch (error) {
            console.error('Ошибка в ready event:', error);
        }
    }
};