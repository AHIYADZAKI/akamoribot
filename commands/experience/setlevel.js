const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlevel')
        .setDescription('Установить уровень пользователю')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для изменения уровня')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Уровень')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const level = interaction.options.getInteger('level');

        if (level < 1) {
            return interaction.reply({ 
                content: '❌ Уровень не может быть меньше 1',
                ephemeral: true 
            });
        }

        try {
            const user = await User.findOneAndUpdate(
                { userId: target.id, guildId: interaction.guild.id },
                { $set: { level: level, xp: 0 } },
                { upsert: true, new: true }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Уровень установлен')
                .setDescription(`Установлен ${level} уровень для ${target.tag}`)
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
                content: '❌ Произошла ошибка при установке уровня',
                ephemeral: true 
            });
        }
    },
};