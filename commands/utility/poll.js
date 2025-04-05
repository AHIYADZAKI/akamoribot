const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Создать голосование')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Вопрос для голосования')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Варианты через запятую (макс 10)')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const options = interaction.options.getString('options')
            .split(',')
            .map(opt => opt.trim())
            .filter(opt => opt.length > 0)
            .slice(0, 10); // Ограничиваем 10 вариантами

        if (options.length < 2) {
            return interaction.reply({ 
                content: '❌ Укажите минимум 2 варианта через запятую', 
                ephemeral: true 
            });
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        const optionsText = options.map((opt, i) => `${emojis[i]} ${opt}`).join('\n');

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(`📊 Голосование: ${question}`)
            .setDescription(optionsText)
            .setFooter({ text: `Создано ${interaction.user.tag}` })
            .setTimestamp();

        const message = await interaction.reply({ 
            embeds: [embed], 
            fetchReply: true 
        });

        // Добавляем реакции
        for (let i = 0; i < options.length; i++) {
            await message.react(emojis[i]);
        }
    },
};