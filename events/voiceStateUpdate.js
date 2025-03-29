const { logAction } = require('../utils/logger');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    // User joined a voice channel
    if (!oldState.channelId && newState.channelId) {
      await logAction(newState.guild, 'Voice Join', newState.member.user, newState.member.user, 
        `Channel: ${newState.channel.name}`);
    }
    
    // User left a voice channel
    if (oldState.channelId && !newState.channelId) {
      await logAction(oldState.guild, 'Voice Leave', oldState.member.user, oldState.member.user, 
        `Channel: ${oldState.channel.name}`);
    }
    
    // User moved between voice channels
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      await logAction(newState.guild, 'Voice Move', newState.member.user, newState.member.user, 
        `From: ${oldState.channel.name}\nTo: ${newState.channel.name}`);
    }
    
    // User muted/unmuted/deafened/etc.
    const changes = [];
    if (oldState.serverMute !== newState.serverMute) changes.push(`Server Mute: ${newState.serverMute ? 'ON' : 'OFF'}`);
    if (oldState.serverDeaf !== newState.serverDeaf) changes.push(`Server Deaf: ${newState.serverDeaf ? 'ON' : 'OFF'}`);
    if (oldState.selfMute !== newState.selfMute) changes.push(`Self Mute: ${newState.selfMute ? 'ON' : 'OFF'}`);
    if (oldState.selfDeaf !== newState.selfDeaf) changes.push(`Self Deaf: ${newState.selfDeaf ? 'ON' : 'OFF'}`);
    if (oldState.streaming !== newState.streaming) changes.push(`Streaming: ${newState.streaming ? 'ON' : 'OFF'}`);
    if (oldState.video !== newState.video) changes.push(`Video: ${newState.video ? 'ON' : 'OFF'}`);

    if (changes.length > 0) {
      const channelName = newState.channel?.name || oldState.channel?.name || 'Unknown';
      await logAction(newState.guild, 'Voice State Change', newState.member.user, newState.member.user, 
        `Channel: ${channelName}\nChanges: ${changes.join(', ')}`);
    }
  },
};