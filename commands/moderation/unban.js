const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const modLog = require('../../systems/logging/modLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the unban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ You do not have permission to unban members')],
                ephemeral: true
            });
        }

        try {
            await interaction.guild.bans.remove(userId, reason);
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Successfully unbanned user with ID ${userId}`)
                .addFields({ name: 'Reason', value: reason })
                .setFooter({ text: `Moderator: ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            
            // Get user object if possible for logging
            let user;
            try {
                user = await interaction.client.users.fetch(userId);
            } catch (e) {
                user = { id: userId, tag: 'Unknown#0000' };
            }
            
            await modLog(interaction.guild, interaction.user, 'unban', user, reason);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ There was an error trying to unban this user')],
                ephemeral: true
            });
        }
    },
};