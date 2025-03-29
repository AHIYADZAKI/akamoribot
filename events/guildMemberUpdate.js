const { logAction } = require('../utils/logger');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    // Check for nickname changes
    if (oldMember.nickname !== newMember.nickname) {
      const oldNick = oldMember.nickname || 'None';
      const newNick = newMember.nickname || 'None';
      await logAction(newMember.guild, 'Nickname Change', newMember.user, newMember.user, 
        `From: ${oldNick}\nTo: ${newNick}`);
    }

    // Check for role changes
    if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
      const addedRoles = newMember.roles.cache
        .filter(role => !oldMember.roles.cache.has(role.id))
        .map(role => role.name);
      
      const removedRoles = oldMember.roles.cache
        .filter(role => !newMember.roles.cache.has(role.id))
        .map(role => role.name);

      if (addedRoles.length > 0) {
        await logAction(newMember.guild, 'Role Added', newMember.user, newMember.user, 
          `Roles: ${addedRoles.join(', ')}`);
      }

      if (removedRoles.length > 0) {
        await logAction(newMember.guild, 'Role Removed', newMember.user, newMember.user, 
          `Roles: ${removedRoles.join(', ')}`);
      }
    }
  },
};