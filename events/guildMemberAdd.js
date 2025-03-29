const { logAction } = require('../utils/logger');
const config = require('../config.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // Get who invited the member
    const invites = await member.guild.invites.fetch();
    const invite = invites.find(i => i.uses > 0 && i.inviter && i.inviter.id !== member.guild.ownerId);
    const inviter = invite?.inviter || 'Unknown';

    // Account creation date
    const createdAt = member.user.createdAt.toLocaleString();

    const logMessage = `Member joined: ${member.user.tag} (${member.id})\n` +
      `Account created: ${createdAt}\n` +
      `Invited by: ${inviter.tag || inviter} (${inviter.id || 'N/A'})`;

    await logAction(member.guild, 'Member Join', member.user, member.user, logMessage);
  },
};