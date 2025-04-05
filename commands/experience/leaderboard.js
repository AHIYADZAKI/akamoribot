const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const { pagination } = require('../../utils/pagination');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp-leaderboard')
        .setDescription('Топ пользователей по опыту'),
    async execute(interaction) {
        try {
            const users = await User.find({ guildId: interaction.guild.id })
                .sort({ level: -1, xp: -1 })
                .limit(100);

            if (users.length === 0) {
                return interaction.reply({ 
                    content: '🏆 На сервере пока нет пользователей с опытом',
                    ephemeral: true 
                });
            }

            const itemsPerPage = 10;
            const pages = [];

            for (let i = 0; i < users.length; i += itemsPerPage) {
                const pageUsers = users.slice(i, i + itemsPerPage);
                const embed = new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setTitle(`🏆 Топ ${users.length} пользователей по опыту`)
                    .setDescription(
                        pageUsers.map((user, index) => 
                            `**${i + index + 1}.** <@${user.userId}> - Уровень ${user.level} (${user.xp} XP)`
                        ).join('\n')
                    )
                    .setFooter({ text: `Страница ${Math.floor(i / itemsPerPage) + 1}/${Math.ceil(users.length / itemsPerPage)}` });

                pages.push(embed);
            }

            await pagination(interaction, pages);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при загрузке таблицы лидеров',
                ephemeral: true 
            });
        }
    },
};