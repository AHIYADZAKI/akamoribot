const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setxp')
        .setDescription('Установить опыт пользователю')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для изменения опыта')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Количество опыта')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (amount < 0) {
            return interaction.reply({ 
                content: '❌ Количество опыта не может быть отрицательным',
                ephemeral: true 
            });
        }

        try {
            const user = await User.findOneAndUpdate(
                { userId: target.id, guildId: interaction.guild.id },
                { $set: { xp: amount } },
                { upsert: true, new: true }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Опыт установлен')
                .setDescription(`Установлено ${amount} XP для ${target.tag}`)
                .addFields(
                    { name: 'Текущий уровень', value: user.level.toString(), inline: true },
                    { name: 'Текущий опыт', value: user.xp.toString(), inline: true }
                )
                .setFooter({ text: `Изменено ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при установке опыта',
                ephemeral: true 
            });
        }
    },
};