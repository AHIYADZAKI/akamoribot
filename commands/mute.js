const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logAction } = require('../utils/logger');
const config = require('../config.json'); // Добавляем импорт конфига

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user in the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute'))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration of the mute (e.g., 1h, 30m, 2d)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    // Проверка прав через конфиг
    if (!interaction.member.roles.cache.some(r => config.moderatorRoles.includes(r.id))) {
      return interaction.reply({ 
        content: 'You do not have permission to use this command.', 
        flags: 1 << 6 // Эквивалент ephemeral: true
      });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const duration = interaction.options.getString('duration');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ 
        content: 'That user is not in this server.',
        flags: 1 << 6
      });
    }

    try {
      if (duration) {
        // Handle timed mute
        const timeMatch = duration.match(/^(\d+)([hHmMdD])$/);
        if (!timeMatch) {
          return interaction.reply({ 
            content: 'Invalid time format. Use number followed by h, m, or d (e.g., 1h, 30m, 2d).',
            flags: 1 << 6
          });
        }

        const amount = parseInt(timeMatch[1]);
        const unit = timeMatch[2].toLowerCase();

        let milliseconds;
        switch (unit) {
          case 'h': milliseconds = amount * 60 * 60 * 1000; break;
          case 'm': milliseconds = amount * 60 * 1000; break;
          case 'd': milliseconds = amount * 24 * 60 * 60 * 1000; break;
        }

        await member.timeout(milliseconds, reason);
        await logAction(interaction.guild, 'Timeout', interaction.user, user, reason, duration);
        await interaction.reply({ 
          content: `Successfully muted ${user.tag} for ${duration}. Reason: ${reason}`,
          flags: 1 << 6
        });
      } else {
        // Handle permanent mute with role
        const muteRole = interaction.guild.roles.cache.get(config.muteRoleId);
        if (!muteRole) {
          return interaction.reply({ 
            content: 'Mute role not found.',
            flags: 1 << 6
          });
        }

        await member.roles.add(muteRole, reason);
        await logAction(interaction.guild, 'Mute', interaction.user, user, reason);
        await interaction.reply({ 
          content: `Successfully muted ${user.tag}. Reason: ${reason}`,
          flags: 1 << 6
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ 
        content: 'There was an error trying to mute this user.',
        flags: 1 << 6
      });
    }
  },
};