const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        try {
            // Находим канал по умолчанию для приветствия
            const channel = guild.systemChannel || guild.channels.cache.find(c => 
                c.type === 'GUILD_TEXT' && c.permissionsFor(guild.me).has('SEND_MESSAGES')
            );

            if (channel) {
                const embed = new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setTitle(`Спасибо за добавление ${guild.client.user.username}!`)
                    .setDescription(
                        `Используйте \`/help\` для списка команд\n` +
                        `Настройте бота под свои нужды!\n\n` +
                        `Серверов с ботом: ${guild.client.guilds.cache.size}`
                    )
                    .setThumbnail(guild.client.user.displayAvatarURL());

                await channel.send({ embeds: [embed] });
            }

            console.log(`➕ Добавлен на сервер: ${guild.name} (${guild.id})`);
        } catch (error) {
            console.error('Ошибка в guildCreate:', error);
        }
    }
};