const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const actionColors = {
  'Ban': 0xFF0000,
  'Unban': 0x00FF00,
  'Mute': 0xFFA500,
  'Unmute': 0x00FF00,
  'Timeout': 0xFFA500,
  'Remove Timeout': 0x00FF00,
  'Member Join': 0x00FF00,
  'Member Leave': 0xFF0000,
  'Nickname Change': 0xADD8E6,
  'Role Added': 0x90EE90,
  'Role Removed': 0xFFCCCB,
  'Message Sent': 0xFFFFFF,
  'Message Edited': 0xFFFF00,
  'Message Deleted': 0xFF0000,
  'Voice Join': 0x00FF00,
  'Voice Leave': 0xFF0000,
  'Voice Move': 0xADD8E6,
  'Voice State Change': 0xFFFF00
};

module.exports.logAction = async function(guild, action, moderator, target, reason = 'No reason provided', duration = null) {
  try {
    // Send to log channel
    const logChannel = await guild.channels.fetch(config.logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor(actionColors[action] || 0x0000FF)
      .setTitle(`Action: ${action}`)
      .addFields(
        { name: 'User', value: `${target} (${target.id})`, inline: true },
        { name: 'Moderator', value: moderator.id === target.id ? 'System' : `${moderator} (${moderator.id})`, inline: true },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    if (duration) {
      embed.addFields({ name: 'Duration', value: duration, inline: true });
    }

    await logChannel.send({ embeds: [embed] });

    // Log to file
    const logEntry = `[${new Date().toISOString()}] ${action} | User: ${target.id} | Moderator: ${moderator.id} | Reason: ${reason}${duration ? ` | Duration: ${duration}` : ''}\n`;
    const logFile = path.join(__dirname, '../moderation.log');
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

async function logAction(guild, action, moderator, target, reason) {
  const channel = guild.channels.cache.get(config.logChannelId);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle(`Action: ${action}`)
    .addFields(
      { name: 'User', value: target.toString(), inline: true },
      { name: 'Moderator', value: moderator.toString(), inline: true },
      { name: 'Reason', value: reason }
    )
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}