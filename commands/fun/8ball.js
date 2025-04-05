const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

const responses = [
    'Бесспорно',
    'Предрешено',
    'Никаких сомнений',
    'Определённо да',
    'Можешь быть уверен в этом',
    'Мне кажется — «да»',
    'Вероятнее всего',
    'Хорошие перспективы',
    'Знаки говорят — «да»',
    'Да',
    'Пока не ясно, попробуй снова',
    'Спроси позже',
    'Лучше не рассказывать',
    'Сейчас нельзя предсказать',
    'Сконцентрируйся и спроси опять',
    'Даже не думай',
    'Мой ответ — «нет»',
    'По моим данным — «нет»',
    'Перспективы не очень хорошие',
    'Весьма сомнительно'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Магический шар предсказаний')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Ваш вопрос')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const answer = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setColor(config.colors.fun)
            .setTitle('🎱 Магический шар')
            .addFields(
                { name: 'Вопрос', value: question },
                { name: 'Ответ', value: answer }
            );

        await interaction.reply({ embeds: [embed] });
    }
};