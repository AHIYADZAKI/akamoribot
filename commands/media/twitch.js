const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('twitch')
        .setDescription('Проверить статус стримера на Twitch')
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('Имя канала')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getString('channel');

        try {
            // Здесь должна быть логика проверки Twitch API
            // Это примерная реализация
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎮 Twitch информация')
                .setDescription(`Проверка канала: ${channel}`)
                .addFields(
                    { name: 'Статус', value: 'Не реализовано', inline: true },
                    { name: 'Зрители', value: 'Не реализовано', inline: true }
                )
                .setFooter({ text: 'Интеграция с Twitch API не настроена' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Произошла ошибка при проверке Twitch канала',
                ephemeral: true
            });
        }
    }
};