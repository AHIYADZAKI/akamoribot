const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Подбросить монетку'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Орёл' : 'Решка';
        const emoji = result === 'Орёл' ? '🦅' : '🪙';

        const embed = new EmbedBuilder()
            .setColor(config.colors.fun)
            .setDescription(`${emoji} Выпало: **${result}**`);

        await interaction.reply({ embeds: [embed] });
    }
};