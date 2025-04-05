const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Media = require('../../systems/database/models/Media');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('media-remove')
        .setDescription('Удалить медиа-канал из отслеживания')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID записи для удаления')
                .setRequired(true)),
    async execute(interaction) {
        const id = interaction.options.getString('id');

        try {
            const result = await Media.deleteOne({ _id: id, guildId: interaction.guild.id });

            if (result.deletedCount === 0) {
                return interaction.reply({
                    content: 'Канал не найден или уже удален',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Канал с ID ${id} удален из отслеживания`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Произошла ошибка при удалении канала',
                ephemeral: true
            });
        }
    }
};