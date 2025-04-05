const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { formatDate } = require('../../utils/time');

module.exports = {
    logMessageDelete: async (message) => {
        try {
            const channel = message.guild.channels.cache.get(config.channels.messageLog);
            if (!channel || message.author.bot) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('🗑️ Сообщение удалено')
                .addFields(
                    { name: 'Автор', value: message.author.tag, inline: true },
                    { name: 'Канал', value: message.channel.toString(), inline: true },
                    { name: 'Содержимое', value: message.content.slice(0, 1024) || '[Нет текста]' }
                )
                .setFooter({ text: `ID: ${message.author.id}` })
                .setTimestamp();

            if (message.attachments.size > 0) {
                embed.addFields({
                    name: 'Вложения',
                    value: message.attachments.map(a => a.url).join('\n')
                });
            }

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в messageDeleteLog:', error);
        }
    },

    logMessageEdit: async (oldMessage, newMessage) => {
        try {
            const channel = newMessage.guild.channels.cache.get(config.channels.messageLog);
            if (!channel || newMessage.author.bot || oldMessage.content === newMessage.content) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.warning)
                .setTitle('✏️ Сообщение изменено')
                .addFields(
                    { name: 'Автор', value: newMessage.author.tag, inline: true },
                    { name: 'Канал', value: newMessage.channel.toString(), inline: true },
                    { name: 'Старое сообщение', value: oldMessage.content.slice(0, 512) || '[Нет текста]' },
                    { name: 'Новое сообщение', value: newMessage.content.slice(0, 512) || '[Нет текста]' }
                )
                .setFooter({ text: `ID: ${newMessage.author.id}` })
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Ошибка в messageEditLog:', error);
        }
    }
};