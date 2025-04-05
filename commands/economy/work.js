const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

const jobs = [
    { name: 'Разработчик', min: 500, max: 1500 },
    { name: 'Дизайнер', min: 300, max: 1000 },
    { name: 'Маркетолог', min: 400, max: 1200 },
    { name: 'Фрилансер', min: 200, max: 800 }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Заработать деньги работой'),
    async execute(interaction) {
        try {
            const cooldown = 3600000; // 1 час
            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            
            if (user && user.lastWork && (Date.now() - user.lastWork) < cooldown) {
                const timeLeft = Math.ceil((cooldown - (Date.now() - user.lastWork)) / 60000);
                return interaction.reply({ 
                    content: `⏳ Вы уже работали сегодня! Попробуйте снова через ${timeLeft} минут.`,
                    ephemeral: true 
                });
            }

            const job = jobs[Math.floor(Math.random() * jobs.length)];
            const earnings = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

            await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { 
                    $inc: { balance: earnings },
                    $set: { lastWork: Date.now() } 
                },
                { upsert: true, new: true }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`💼 Вы работали как ${job.name}`)
                .setDescription(`Вы заработали ${earnings} ${config.currency}!`)
                .setFooter({ text: 'Работайте снова через 1 час' });

            await interaction.reply