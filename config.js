require('dotenv').config(); // Подключаем переменные окружения из .env файла

module.exports = {
    // ============ Основные настройки бота ============
    token: process.env.BOT_TOKEN, // Токен бота из .env
    prefix: '!', // Префикс для текстовых команд
    owners: process.env.OWNERS.split(','), // ID владельцев бота через запятую в .env
    
    // ============ Настройки сервера ============
    guildId: process.env.GUILD_ID, // ID основного сервера (для слэш-команд)
    staffRoles: process.env.STAFF_ROLES.split(','), // Роли модераторов через запятую в .env
    muteRole: process.env.MUTE_ROLE, // ID роли для мута
    
    // ============ Настройки каналов ============
    logChannel: process.env.LOG_CHANNEL, // ID канала для логов
    staffChannel: process.env.STAFF_CHANNEL, // ID канала для персонала
    voiceCategory: process.env.VOICE_CATEGORY, // ID категории для голосовых каналов
    ticketCategory: process.env.TICKET_CATEGORY, // ID категории для тикетов
    
    // ============ Настройки экономики ============
    economy: {
        dailyAmount: 100, // Награда за ежедневный бонус
        workMin: 50, // Минимальная награда за работу
        workMax: 150, // Максимальная награда за работу
        crimeMin: -100, // Минимальный проигрыш/выигрыш за преступление
        crimeMax: 250, // Максимальный выигрыш за преступление
        robMin: 50, // Минимальная сумма для ограбления
        robMax: 500, // Максимальная сумма для ограбления
        robChance: 0.4, // Шанс успешного ограбления (40%)
        startingBalance: 500, // Стартовый баланс новых пользователей
        bankLimit: 10000, // Лимит банка для обычных пользователей
        slotCost: 50, // Стоимость игры в слоты
        slotMultipliers: [0, 2, 5, 10, 20, 50] // Множители для слотов
    },
    
    // ============ Настройки опыта ============
    xp: {
        xpPerMessage: 5, // Опыт за сообщение
        xpCooldown: 60000, // Кулдаун между получением опыта (1 минута)
        levelMultiplier: 100, // Множитель для расчета необходимого опыта
        voiceXpPerMinute: 2, // Опыт за минуту в голосовом канале
        maxLevel: 100 // Максимальный уровень
    },
    
    // ============ Настройки музыки ============
    music: {
        maxQueue: 50, // Максимальное количество треков в очереди
        defaultVolume: 50, // Громкость по умолчанию (50%)
        searchResults: 5, // Количество результатов при поиске
        leaveOnEmpty: true, // Выходить при пустом канале
        leaveOnEmptyCooldown: 300000, // Задержка перед выходом (5 минут)
        leaveOnEnd: true, // Выходить после окончания очереди
        leaveOnEndCooldown: 300000, // Задержка перед выходом (5 минут)
        leaveOnStop: true, // Выходить при остановке
        leaveOnStopCooldown: 300000 // Задержка перед выходом (5 минут)
    },
    
    // ============ Настройки голосовых каналов ============
    voice: {
        createChannel: process.env.VOICE_CREATE_CHANNEL, // ID канала для создания временных голосовых
        bitrate: 64000, // Битрейт голосовых каналов (64 kbps)
        userLimit: 0, // Лимит пользователей (0 - нет лимита)
        defaultName: '🎤│Голосовой {user}' // Шаблон названия канала
    },
    
    // ============ Настройки гильдий ============
    guilds: {
        createCost: 1000, // Стоимость создания гильдии
        upgradeCosts: [5000, 10000, 20000, 50000], // Стоимость улучшений
        maxMembers: [10, 15, 20, 25, 30], // Макс. участников по уровням
        maxBank: [10000, 20000, 50000, 100000, 200000] // Лимиты банка по уровням
    },
    
    // ============ Настройки медиа ============
    media: {
        checkInterval: 300000, // Интервал проверки (5 минут)
        youtubeAPI: process.env.YOUTUBE_API_KEY, // Ключ YouTube API из .env
        twitchClientID: process.env.TWITCH_CLIENT_ID, // Twitch Client ID из .env
        twitchSecret: process.env.TWITCH_SECRET // Twitch Secret из .env
    },
    
    // ============ Настройки цветов Embed ============
    colors: {
        primary: '#5865F2', // Основной цвет (синий Discord)
        success: '#57F287', // Успех (зеленый)
        error: '#ED4245', // Ошибка (красный)
        warning: '#FEE75C', // Предупреждение (желтый)
        info: '#EB459E', // Информация (розовый)
        music: '#1DB954', // Музыка (зеленый Spotify)
        economy: '#F8D030', // Экономика (золотой)
        xp: '#9C59B6' // Опыт (фиолетовый)
    },
    
    // ============ Настройки emoji ============
    emojis: {
        success: '✅', // Успех
        error: '❌', // Ошибка
        warning: '⚠️', // Предупреждение
        loading: '⏳', // Загрузка
        music: '🎵', // Музыка
        economy: '💰', // Экономика
        xp: '✨', // Опыт
        voice: '🔊', // Голосовые
        guild: '🏰', // Гильдии
        media: '📺' // Медиа
    }
};