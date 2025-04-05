const User = require('./models/User');

module.exports = {
    // Получить баланс пользователя
    getBalance: async (userId, guildId) => {
        const user = await User.findOne({ userId, guildId });
        return user ? { balance: user.balance, bank: user.bank } : { balance: 0, bank: 0 };
    },

    // Добавить деньги
    addMoney: async (userId, guildId, amount) => {
        await User.findOneAndUpdate(
            { userId, guildId },
            { $inc: { balance: amount } },
            { upsert: true, new: true }
        );
    },

    // Перевести деньги в банк
    deposit: async (userId, guildId, amount) => {
        const user = await User.findOne({ userId, guildId });
        if (!user || user.balance < amount) return false;
        
        user.balance -= amount;
        user.bank += amount;
        await user.save();
        return true;
    },

    // Снять деньги из банка
    withdraw: async (userId, guildId, amount) => {
        const user = await User.findOne({ userId, guildId });
        if (!user || user.bank < amount) return false;
        
        user.bank -= amount;
        user.balance += amount;
        await user.save();
        return true;
    }
};