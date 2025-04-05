const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const Guild = require('../../systems/database/models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild-create')
        .setDescription('Создать новую гильдию')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название гильдии')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Описание гильдии')
                .setRequired(false)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description') || 'Нет описания';
        const userId = interaction.user.id;

        // Проверяем, состоит ли пользователь уже в гильдии
        const existingGuild = await Guild.findOne({ 
            $or: [
                { leaderId: userId },
                { members: userId }
            ]
        });

        if (existingGuild) {
            return interaction.reply({ 
                content: '❌ Вы уже состоите в гильдии!', 
                ephemeral: true 
            });
        }

        try {
            const newGuild = new Guild({
                name,
                description,
                leaderId: userId,
                members: [userId],
                level: 1,
                experience: 0,
                balance: 0,
                createdAt: new Date()
            });

            await newGuild.save();

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🏰 Новая гильдия создана!')
                .setDescription(`**${name}** успешно создана`)
                .addFields(
                    { name: 'Лидер', value: `<@${userId}>`, inline: true },
                    { name: 'Участников', value: '1', inline: true },
                    { name: 'Описание', value: description, inline: false }
                )
                .setFooter({ text: `Используйте /guild-info для просмотра информации` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при создании гильдии', 
                ephemeral: true 
            });
        }
    },
};