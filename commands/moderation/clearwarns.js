const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const modLog = require('../../systems/logging/modLog');
const Warn = require('../../systems/database/models/Warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarns')
        .setDescription('Clear all warnings for a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to clear warnings for')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for clearing warnings'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ You do not have permission to clear warnings')],
                ephemeral: true
            });
        }

        try {
            const result = await Warn.deleteMany({ 
                guildId: interaction.guild.id, 
                userId: user.id 
            });
            
            if (result.deletedCount === 0) {
                return interaction.reply({ 
                    embeds: [new EmbedBuilder()
                        .setColor(config.colors.info)
                        .setDescription(`ℹ️ ${user.tag} has no warnings to clear`)],
                    ephemeral: true
                });
            }
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Cleared ${result.deletedCount} warnings for ${user.tag} (${user.id})`)
                .addFields({ name: 'Reason', value: reason })
                .setFooter({ text: `Moderator: ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            await modLog(interaction.guild, interaction.user, 'clearwarns', user, reason);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ There was an error trying to clear warnings')],
                ephemeral: true
            });
        }
    },
};