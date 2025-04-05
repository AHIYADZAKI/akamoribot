const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Показать список ролей сервера'),
    async execute(interaction) {
        const roles = interaction.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(role => role.id !== interaction.guild.id) // Убираем @everyone
            .map(role => role.toString());

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`🎭 Роли сервера (${roles.length})`)
            .setDescription(roles.join(', '))
            .setFooter({ text: `Всего ролей: ${roles.length}` });

        await interaction.reply({ embeds: [embed] });
    },
};