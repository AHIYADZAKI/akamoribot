const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logAction } = require('../utils/logger');
const config = require('../config.json');

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
        .setDescription('Reason for the unmute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (!interaction.member.roles.cache.some(r => config.moderatorRoles.includes(r.id))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    if (!member) {
      return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
    }

    try {
      if (member.communicationDisabledUntil) {
        // Remove timeout
        await member.timeout(null, reason);
        await logAction(interaction.guild, 'Remove Timeout', interaction.user, user, reason);
        await interaction.reply({ content: `Successfully unmuted ${user.tag}. Reason: ${reason}`, ephemeral: true });
      } else {
        // Remove mute role
        const muteRole = interaction.guild.roles.cache.get(config.muteRoleId);
        if (!muteRole) {
          return interaction.reply({ content: 'Mute role not found.', ephemeral: true });
        }

        if (member.roles.cache.has(muteRole.id)) {
          await member.roles.remove(muteRole, reason);
          await logAction(interaction.guild, 'Unmute', interaction.user, user, reason);
          await interaction.reply({ content: `Successfully unmuted ${user.tag}. Reason: ${reason}`, ephemeral: true });
        } else {
          await interaction.reply({ content: 'That user is not muted.', ephemeral: true });
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to unmute this user.', ephemeral: true });
    }
  },
};