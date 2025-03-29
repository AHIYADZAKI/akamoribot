const { logAction } = require('../utils/logger');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    
    const logMessage = `Channel: ${message.channel.name}\n` +
      `Content: ${message.content}\n` +
      `Attachments: ${message.attachments.size > 0 ? message.attachments.map(a => a.url).join(', ') : 'None'}`;

    await logAction(message.guild, 'Message Sent', message.author, message.author, logMessage);
  },
};