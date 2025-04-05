const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetxp')
        .setDescription('Сбросить опыт пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для сброса опыта')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getUser('user');

        try {
            await User.findOneAndUpdate(
                { userId: target.id, guildId: interaction.guild.id },
                { $set: { level: 1, xp: 0 } },
                { upsert: true }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔄 Опыт сброшен')
                .setDescription(`Опыт и уровень ${target.tag} были сброшены`)
                .addFields(
                    { name: 'Новый уровень', value: '1', inline: true },
                    { name: 'Новый опыт', value: '0', inline: true }
                )
                .setFooter({ text: `Сброшено ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при сбросе опыта',
                ephemeral: true 
            });
        }
    },
};