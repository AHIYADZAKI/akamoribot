const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Guild = require('../../systems/database/models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-join')
        .setDescription('Вступить в гильдию')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название гильдии')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const userId = interaction.user.id;

        // Проверяем, состоит ли пользователь уже в гильдии
        const userGuild = await Guild.findOne({ 
            $or: [
                { leaderId: userId },
                { members: userId }
            ]
        });

        if (userGuild) {
            return interaction.reply({ 
                content: '❌ Вы уже состоите в гильдии!', 
                ephemeral: true 
            });
        }

        try {
            const guild = await Guild.findOne({ name });

            if (!guild) {
                return interaction.reply({ 
                    content: '❌ Гильдия с таким названием не найдена!', 
                    ephemeral: true 
                });
            }

            if (guild.members.includes(userId)) {
                return interaction.reply({ 
                    content: '❌ Вы уже состоите в этой гильдии!', 
                    ephemeral: true 
                });
            }

            guild.members.push(userId);
            await guild.save();

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`🎉 Вы вступили в гильдию ${guild.name}!`)
                .addFields(
                    { name: 'Лидер', value: `<@${guild.leaderId}>`, inline: true },
                    { name: 'Участников', value: guild.members.length.toString(), inline: true },
                    { name: 'Уровень', value: guild.level.toString(), inline: true }
                )
                .setFooter({ text: `Используйте /guild-info для просмотра информации` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при вступлении в гильдию', 
                ephemeral: true 
            });
        }
    },
};