const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const xpSystem = require('../systems/database/xpSystem');
const { formatDuration } = require('../utils/time');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {
            // Игнорируем ботов
            if (message.author.bot) return;

            // Начисление опыта
            await xpSystem.addXP(message.author.id, message.guild.id);

            // Автомодерация
            if (message.content.length > 1000) {
                await message.delete();
                const warn = await message.channel.send(`${message.author}, сообщение слишком длинное!`);
                setTimeout(() => warn.delete(), 5000);
                return;
            }

            // Ответ на упоминание бота
            if (message.mentions.has(message.client.user)) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setDescription(
                        `Привет! Мой префикс: \`/\`\n` +
                        `Используй \`/help\` для списка команд\n` +
                        `Версия: ${config.bot.version}`
                    );

                await message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Ошибка в messageCreate:', error);
        }
    }
};