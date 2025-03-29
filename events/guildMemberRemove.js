const { logAction } = require('../utils/logger');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const roles = member.roles.cache
      .filter(role => role.id !== member.guild.id)
      .map(role => role.name)
      .join(', ') || 'None';

    const logMessage = `Member left: ${member.user.tag} (${member.id})\n` +
      `Roles: ${roles}\n` +
      `Joined at: ${member.joinedAt.toLocaleString()}`;

    await logAction(member.guild, 'Member Leave', member.user, member.user, logMessage);
  },
};