const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Guild = require('../../systems/database/models/Guild');
const { pagination } = require('../../utils/pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-leaderboard')
        .setDescription('Топ гильдий по уровню и опыту'),
    async execute(interaction) {
        try {
            const guilds = await Guild.find()
                .sort({ level: -1, experience: -1 })
                .limit(100);

            if (guilds.length === 0) {
                return interaction.reply({ 
                    content: '🏆 На сервере пока нет гильдий', 
                    ephemeral: true 
                });
            }

            const itemsPerPage = 10;
            const pages = [];

            for (let i = 0; i < guilds.length; i += itemsPerPage) {
                const guildsSlice = guilds.slice(i, i + itemsPerPage);
                const embed = new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setTitle(`🏆 Топ гильдий (${guilds.length})`)
                    .setDescription(
                        guildsSlice.map((guild, index) => 
                            `**${i + index + 1}.** ${guild.name}\n` +
                            `> Уровень: ${guild.level} | Опыт: ${guild.experience}/${guild.level * 1000}\n` +
                            `> Участников: ${guild.members.length} | Казна: ${guild.treasury} монет\n` +
                            `> Лидер: <@${guild.leaderId}>`
                        ).join('\n\n')
                    )
                    .setFooter({ text: `Страница ${Math.floor(i / itemsPerPage) + 1}/${Math.ceil(guilds.length / itemsPerPage)}` })
                    .setTimestamp();

                pages.push(embed);
            }

            await pagination(interaction, pages);
        } catch (error) {
            console.error('Ошибка при получении топа гильдий:', error);
            await interaction.reply({
                content: 'Произошла ошибка при получении топа гильдий',
                ephemeral: true
            });
        }
    }
};