const User = require('./models/User');

module.exports = {
    // Добавить опыт
    addXP: async (userId, guildId, xp = 10) => {
        const user = await User.findOneAndUpdate(
            { userId, guildId },
            { $inc: { experience: xp } },
            { upsert: true, new: true }
        );

        // Проверка на повышение уровня
        const neededXP = user.level * 1000;
        if (user.experience >= neededXP) {
            user.level += 1;
            await user.save();
            return { leveledUp: true, newLevel: user.level };
        }

        return { leveledUp: false };
    },

    // Установить уровень
    setLevel: async (userId, guildId, level) => {
        await User.findOneAndUpdate(
            { userId, guildId },
            { level, experience: 0 },
            { upsert: true }
        );
    },

    // Получить информацию об уровне
    getLevelInfo: async (userId, guildId) => {
        const user = await User.findOne({ userId, guildId });
        if (!user) return { level: 1, experience: 0, neededXP: 1000 };
        
        return {
            level: user.level,
            experience: user.experience,
            neededXP: user.level * 1000
        };
    }
};