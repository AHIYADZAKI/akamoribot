const Media = require('./models/Media');

module.exports = {
    // Добавить медиа-канал для отслеживания
    addMediaChannel: async (guildId, platform, channelId) => {
        await Media.create({ guildId, platform, channelId });
    },

    // Удалить медиа-канал
    removeMediaChannel: async (id) => {
        await Media.findByIdAndDelete(id);
    },

    // Получить все медиа-каналы сервера
    getGuildMediaChannels: async (guildId) => {
        return await Media.find({ guildId });
    },

    // Обновить время последней проверки
    updateLastChecked: async (id) => {
        await Media.findByIdAndUpdate(id, { lastChecked: new Date() });
    },

    // Установить канал для уведомлений
    setNotificationChannel: async (guildId, channelId, roleId = null) => {
        await Media.updateMany(
            { guildId },
            { notificationChannel: channelId, mentionRole: roleId }
        );
    }
};