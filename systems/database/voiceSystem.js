const Voice = require('./models/Voice');
const User = require('./models/User');

module.exports = {
    // Начать отсчет времени в голосовом канале
    startVoiceSession: async (userId, guildId, channelId) => {
        await Voice.create({ userId, guildId, channelId });
    },

    // Завершить сессию в голосовом канале
    endVoiceSession: async (userId, guildId) => {
        const session = await Voice.findOne({ userId, guildId, endTime: null });
        if (!session) return 0;

        session.endTime = new Date();
        session.duration = session.endTime - session.startTime;
        await session.save();

        // Обновить общее время в голосовых каналах
        await User.findOneAndUpdate(
            { userId, guildId },
            { $inc: { voiceTime: session.duration } },
            { upsert: true }
        );

        return session.duration;
    },

    // Получить общее время в голосовых каналах
    getVoiceTime: async (userId, guildId) => {
        const user = await User.findOne({ userId, guildId });
        return user ? user.voiceTime : 0;
    }
};