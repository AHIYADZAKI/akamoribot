const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Показать информацию о боте'),
    async execute(interaction) {
        const client = interaction.client;
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`🤖 Информация о ${client.user.username}`)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '📛 Имя бота', value: client.user.tag, inline: true },
                { name: '🆔 ID', value: client.user.id, inline: true },
                { name: '📅 Дата создания', value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:D>`, inline: true },
                { name: '⏱ Аптайм', value: `${days}д ${hours}ч ${minutes}м ${seconds}с`, inline: true },
                { name: '📊 Статистика', value: `Серверов: ${client.guilds.cache.size}\nПользователей: ${client.users.cache.size}`, inline: true },
                { name: '💻 Система', value: `ОС: ${os.platform()}\nЯдер: ${os.cpus().length}\nRAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`, inline: true }
            )
            .setFooter({ text: `Версия ${config.version}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};