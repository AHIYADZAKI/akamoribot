const { logAction } = require('../utils/logger');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (newMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const logMessage = `Channel: ${newMessage.channel.name}\n` +
      `Original: ${oldMessage.content}\n` +
      `Edited: ${newMessage.content}`;

    await logAction(newMessage.guild, 'Message Edited', newMessage.author, newMessage.author, logMessage);
  },
};