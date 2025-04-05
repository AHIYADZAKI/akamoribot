const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('/home/container/config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crime')
        .setDescription('Попытаться заработать преступным путем'),
    async execute(interaction) {
        try {
            const cooldown = 7200000; // 2 часа
            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            
            if (user && user.lastCrime && (Date.now() - user.lastCrime) < cooldown) {
                const timeLeft = Math.ceil((cooldown - (Date.now() - user.lastCrime)) / 60000);
                return interaction.reply({ 
                    content: `⏳ Вы уже совершали преступление! Попробуйте снова через ${timeLeft} минут.`,
                    ephemeral: true 
                });
            }

            const success = Math.random() < 0.6; // 60% шанс успеха
            let amount = 0;
            let result = '';

            if (success) {
                amount = Math.floor(Math.random() * 1500) + 500;
                result = `✅ Вы успешно ограбили банк и получили ${amount} ${config.currency}!`;
                await User.findOneAndUpdate(
                    { userId: interaction.user.id, guildId: interaction.guild.id },
                    { 
                        $inc: { balance: amount },
                        $set: { lastCrime: Date.now() } 
                    },
                    { upsert: true }
                );
            } else {
                amount = Math.floor(Math.random() * 1000) + 200;
                result = `❌ Вас поймала полиция! Вы потеряли ${amount} ${config.currency} в качестве штрафа.`;
                await User.findOneAndUpdate(
                    { userId: interaction.user.id, guildId: interaction.guild.id },
                    { 
                        $inc: { balance: -amount },
                        $set: { lastCrime: Date.now() } 
                    },
                    { upsert: true }
                );
            }

            const embed = new EmbedBuilder()
                .setColor(success ? config.colors.success : config.colors.error)
                .setTitle(success ? '🦹‍♂️ Успешное преступление' : '👮‍♂️ Провал')
                .setDescription(result)
                .setFooter({ text: 'Попробуйте снова через 2 часа' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при совершении преступления',
                ephemeral: true 
            });
        }
    },
};