const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Guild = require('../../systems/database/models/Guild');
const { pagination } = require('../../utils/pagination');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-members')
        .setDescription('Показать список участников гильдии')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название гильдии (оставьте пустым для своей гильдии)')
                .setRequired(false)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const userId = interaction.user.id;

        try {
            let guild;
            if (name) {
                guild = await Guild.findOne({ name });
            } else {
                guild = await Guild.findOne({ 
                    $or: [
                        { leaderId: userId },
                        { members: userId }
                    ]
                });
            }

            if (!guild) {
                return interaction.reply({ 
                    content: '❌ Гильдия не найдена!', 
                    ephemeral: true 
                });
            }

            const itemsPerPage = 10;
            const pages = [];
            
            for (let i = 0; i < guild.members.length; i += itemsPerPage) {
                const membersSlice = guild.members.slice(i, i + itemsPerPage);
                const embed = new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setTitle(`👥 Участники гильдии ${guild.name}`)
                    .setDescription(
                        membersSlice.map((member, index) => 
                            `**${i + index + 1}.** <@${member}>` + 
                            (member === guild.leaderId ? ' 👑' : '')
                        ).join('\n')
                    )
                    .setFooter({ 
                        text: `Страница ${Math.floor(i / itemsPerPage) + 1}/${Math.ceil(guild.members.length / itemsPerPage)} | Всего: ${guild.members.length}` 
                    });

                pages.push(embed);
            }

            if (pages.length === 0) {
                pages.push(new EmbedBuilder()
                    .setColor(config.colors.primary)
                    .setTitle(`👥 Участники гильдии ${guild.name}`)
                    .setDescription('Нет участников')
                );
            }

            await pagination(interaction, pages);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при получении списка участников', 
                ephemeral: true 
            });
        }
    },
};