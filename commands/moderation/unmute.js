const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../../../config');
const modLog = require('../../systems/logging/modLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user in the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the unmute'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ You do not have permission to unmute members')],
                ephemeral: true
            });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.timeout(null, reason);
            
            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setDescription(`✅ Successfully unmuted ${user.tag} (${user.id})`)
                .addFields({ name: 'Reason', value: reason })
                .setFooter({ text: `Moderator: ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            await modLog(interaction.guild, interaction.user, 'unmute', user, reason);
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                embeds: [new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setDescription('❌ There was an error trying to unmute this user')],
                ephemeral: true
            });
        }
    },
};