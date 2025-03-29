const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('View moderation logs')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Type of logs to view')
        .addChoices(
          { name: 'Bans', value: 'ban' },
          { name: 'Mutes', value: 'mute' },
          { name: 'Joins/Leaves', value: 'members' },
          { name: 'Messages', value: 'messages' },
          { name: 'Voice', value: 'voice' },
          { name: 'Roles', value: 'roles' }
        ))
    .addIntegerOption(option =>
      option.setName('limit')
        .setDescription('Number of entries to show (default: 10)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    if (!interaction.member.roles.cache.some(r => config.moderatorRoles.includes(r.id))) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const logType = interaction.options.getString('type') || 'all';
    const limit = interaction.options.getInteger('limit') || 10;

    try {
      const logFile = path.join(__dirname, '../../moderation.log');
      if (!fs.existsSync(logFile)) {
        return interaction.reply({ content: 'No logs found.', ephemeral: true });
      }

      const logs = fs.readFileSync(logFile, 'utf8').split('\n').filter(line => line.trim() !== '');
      let filteredLogs = logs;

      if (logType !== 'all') {
        filteredLogs = logs.filter(line => line.includes(` ${logType} `));
      }

      const recentLogs = filteredLogs.slice(-limit).reverse();

      if (recentLogs.length === 0) {
        return interaction.reply({ content: 'No logs found for the specified type.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle(`Moderation Logs (${logType})`)
        .setColor(0x0099FF)
        .setDescription(`Showing ${recentLogs.length} most recent entries:\n\`\`\`\n${recentLogs.join('\n')}\n\`\`\``);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to fetch logs.', ephemeral: true });
    }
  },
};