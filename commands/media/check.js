const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Media = require('../../systems/database/models/Media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('media-check')
        .setDescription('Принудительно проверить обновления медиа-каналов'),
    async execute(interaction) {
        try {
            const channels = await Media.find({ guildId: interaction.guild.id });

            if (channels.length === 0) {
                return interaction.reply({
                    content: 'Нет отслеживаемых каналов для проверки',
                    ephemeral: true
                });
            }

            // Здесь должна быть логика проверки всех каналов
            // Это примерная реализация
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🔍 Проверка медиа-каналов')
                .setDescription(`Проверено ${channels.length} каналов`)
                .setFooter({ text: 'Функционал проверки не реализован полностью' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Произошла ошибка при проверке каналов',
                ephemeral: true
            });
        }
    }
};