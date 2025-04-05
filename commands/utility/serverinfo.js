const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Показать информацию о сервере'),
    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`ℹ️ Информация о сервере ${guild.name}`)
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '👑 Владелец', value: owner.user.tag, inline: true },
                { name: '🆔 ID сервера', value: guild.id, inline: true },
                { name: '📅 Создан', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                { name: '👥 Участники', value: `${guild.memberCount}`, inline: true },
                { name: '💬 Каналы', value: `${guild.channels.cache.size}`, inline: true },
                { name: '🎭 Роли', value: `${guild.roles.cache.size}`, inline: true },
                { name: '🚀 Уровень буста', value: `Уровень ${guild.premiumTier} (${guild.premiumSubscriptionCount} бустов)`, inline: true }
            )
            .setFooter({ text: `Запрошено ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};