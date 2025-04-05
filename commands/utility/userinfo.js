const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Показать информацию о пользователе')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для просмотра информации')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setColor(member?.displayColor || config.colors.primary)
            .setTitle(`👤 Информация о ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ size: 1024 }))
            .addFields(
                { name: '📛 Имя пользователя', value: user.tag, inline: true },
                { name: '🆔 ID', value: user.id, inline: true },
                { name: '📅 Дата регистрации', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
                { name: '📅 Присоединился', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'Нет на сервере', inline: true },
                { name: '🎭 Роли', value: member ? `${member.roles.cache.size - 1}` : 'Нет на сервере', inline: true },
                { name: '🚀 Буст сервера', value: member?.premiumSince ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>` : 'Не бустит', inline: true }
            )
            .setFooter({ text: `Запрошено ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};