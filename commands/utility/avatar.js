const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Показать аватар пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для просмотра аватара')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`🖼 Аватар ${user.username}`)
            .setImage(user.displayAvatarURL({ size: 1024 }))
            .setFooter({ text: `Запрошено ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};