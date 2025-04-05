const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Попытаться ограбить пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для ограбления')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');

        if (target.id === interaction.user.id) {
            return interaction.reply({ 
                content: '❌ Вы не можете ограбить себя',
                ephemeral: true 
            });
        }

        try {
            const cooldown = 10800000; // 3 часа
            const robber = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            const victim = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

            if (robber && robber.lastRob && (Date.now() - robber.lastRob) < cooldown) {
                const timeLeft = Math.ceil((cooldown - (Date.now() - robber.lastRob)) / 60000);
                return interaction.reply({ 
                    content: `⏳ Вы уже пытались ограбить кого-то! Попробуйте снова через ${timeLeft} минут.`,
                    ephemeral: true 
                });
            }

            if (!victim || victim.balance < 100) {
                return interaction.reply({ 
                    content: '❌ У этого пользователя недостаточно денег для ограбления',
                    ephemeral: true 
                });
            }

            const success = Math.random() < 0.4; // 40% шанс успеха
            const maxRob = Math.min(victim.balance, Math.floor(victim.balance * 0.3));
            const amount = Math.floor(Math.random() * maxRob) + 1;
            let result = '';

            if (success) {
                await User.findOneAndUpdate(
                    { userId: interaction.user.id, guildId: interaction.guild.id },
                    { 
                        $inc: { balance: amount },
                        $set: { lastRob: Date.now() } 
                    },
                    { upsert: true }
                );

                await User.findOneAndUpdate(
                    { userId: target.id, guildId: interaction.guild.id },
                    { $inc: { balance: -amount } }
                );

                result = `✅ Вы успешно ограбили ${target.username} и украли ${amount} ${config.currency}!`;
            } else {
                const fine = Math.floor(amount * 0.5);
                await User.findOneAndUpdate(
                    { userId: interaction.user.id, guildId: interaction.guild.id },
                    { 
                        $inc: { balance: -fine },
                        $set: { lastRob: Date.now() } 
                    },
                    { upsert: true }
                );

                result = `❌ Вас поймали при попытке ограбить ${target.username}! Вы заплатили штраф ${fine} ${config.currency}.`;
            }

            const embed = new EmbedBuilder()
                .setColor(success ? config.colors.success : config.colors.error)
                .setTitle(success ? '💰 Успешное ограбление' : '👮‍♂️ Провал')
                .setDescription(result)
                .setFooter({ text: 'Попробуйте снова через 3 часа' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при попытке ограбления',
                ephemeral: true 
            });
        }
    },
};