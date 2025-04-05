const { VoiceState } = require('discord.js');
const Voice = require('../../systems/database/models/Voice');

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async execute(oldState, newState) {
        const member = newState.member;
        const guild = member.guild;
        
        // Получаем настройки голосовых каналов для сервера
        const voiceData = await Voice.findOne({ guildId: guild.id });
        if (!voiceData) return;

        // Проверяем, зашел ли пользователь в канал создания
        if (newState.channelId === voiceData.createChannelId) {
            try {
                const channelName = `🔊 ${member.user.username}`;
                const newChannel = await guild.channels.create({
                    name: channelName,
                    type: 'GUILD_VOICE',
                    parent: voiceData.categoryId,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: ['MANAGE_CHANNELS', 'MOVE_MEMBERS']
                        },
                        {
                            id: guild.id,
                            deny: ['CONNECT']
                        }
                    ]
                });

                // Перемещаем пользователя в новый канал
                await member.voice.setChannel(newChannel);
            } catch (error) {
                console.error('Ошибка при создании голосового канала:', error);
            }
        }

        // Проверяем, покинул ли пользователь канал (удаляем пустые каналы)
        if (oldState.channel?.parentId === voiceData.categoryId && 
            oldState.channel.id !== voiceData.createChannelId && 
            oldState.channel.members.size === 0) {
            try {
                await oldState.channel.delete();
            } catch (error) {
                console.error('Ошибка при удалении голосового канала:', error);
            }
        }
    },
};