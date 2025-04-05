const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Показать баннер пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для просмотра баннера')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const fullUser = await user.fetch(true); // Получаем полную информацию о пользователе

        if (!fullUser.banner) {
            return interaction.reply({ 
                content: '❌ У этого пользователя нет баннера', 
                ephemeral: true 
            });
        }

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`🎨 Баннер ${user.username}`)
            .setImage(fullUser.bannerURL({ size: 1024 }))
            .setFooter({ text: `Запрошено ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};