const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

module.exports = {
    customId: 'role-menu',
    async execute(interaction) {
        try {
            const roleId = interaction.customId.split('-')[2];
            const role = interaction.guild.roles.cache.get(roleId);

            if (!role) {
                return interaction.reply({
                    content: 'Роль не найдена!',
                    ephemeral: true
                });
            }

            const hasRole = interaction.member.roles.cache.has(role.id);

            if (hasRole) {
                await interaction.member.roles.remove(role);
                const embed = new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setDescription(`✅ Роль ${role.name} была удалена`);

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.member.roles.add(role);
                const embed = new EmbedBuilder()
                    .setColor(config.colors.success)
                    .setDescription(`✅ Роль ${role.name} была добавлена`);

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error('Ошибка в roleMenu:', error);
            await interaction.reply({
                content: 'Произошла ошибка при выдаче роли',
                ephemeral: true
            });
        }
    }
};