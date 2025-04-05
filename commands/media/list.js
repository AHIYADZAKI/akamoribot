const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Media = require('../../systems/database/models/Media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('media-list')
        .setDescription('Список отслеживаемых медиа-каналов'),
    async execute(interaction) {
        try {
            const channels = await Media.find({ guildId: interaction.guild.id });

            if (channels.length === 0) {
                return interaction.reply({
                    content: 'Нет отслеживаемых каналов',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('📺 Отслеживаемые каналы')
                .setDescription(
                    channels.map(ch => 
                        `**ID:** ${ch._id}\n` +
                        `**Платформа:** ${ch.platform}\n` +
                        `**Канал:** ${ch.channelId}\n` +
                        `**Последняя проверка:** <t:${Math.floor(ch.lastChecked.getTime() / 1000)}:R>`
                    ).join('\n\n')
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Произошла ошибка при получении списка каналов',
                ephemeral: true
            });
        }
    }
};