const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Получить ежедневную награду'),
    async execute(interaction) {
        try {
            const reward = 1000;
            const user = await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { 
                    $inc: { balance: reward },
                    $set: { lastDaily: Date.now() } 
                },
                { upsert: true, new: true }
            );

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🎉 Ежедневная награда')
                .setDescription(`Вы получили ${reward} ${config.currency}!`)
                .addFields(
                    { name: 'Новый баланс', value: `${user.balance + reward} ${config.currency}` }
                )
                .setFooter({ text: 'Возвращайтесь завтра за новой наградой!' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при выдаче награды',
                ephemeral: true 
            });
        }
    },
};