const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const User = require('../../systems/database/models/User');

const emojis = ['🍎', '🍊', '🍇', '🍒', '🍋', '💰', '7️⃣'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Играть в игровые автоматы')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('Сумма ставки')
                .setRequired(true)
                .setMinValue(10)),
    async execute(interaction) {
        const bet = interaction.options.getInteger('bet');

        try {
            const user = await User.findOne({ 
                userId: interaction.user.id, 
                guildId: interaction.guild.id 
            });

            if (!user || user.balance < bet) {
                return interaction.reply({ 
                    content: `❌ У вас недостаточно средств для ставки (Минимум: 10 ${config.currency})`,
                    ephemeral: true 
                });
            }

            // Генерация результатов
            const slots = [
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)],
                emojis[Math.floor(Math.random() * emojis.length)]
            ];

            // Проверка выигрыша
            let winMultiplier = 0;
            if (slots[0] === slots[1] && slots[1] === slots[2]) {
                if (slots[0] === '💰') winMultiplier = 5;
                else if (slots[0] === '7️⃣') winMultiplier = 10;
                else winMultiplier = 3;
            } else if (slots[0] === slots[1] || slots[1] === slots[2] || slots[0] === slots[2]) {
                winMultiplier = 1.5;
            }

            const winAmount = Math.floor(bet * winMultiplier);
            const result = winMultiplier > 0 ? 
                `🎉 Вы выиграли ${winAmount} ${config.currency}!` : 
                '❌ Вы проиграли свою ставку';

            await User.findOneAndUpdate(
                { userId: interaction.user.id, guildId: interaction.guild.id },
                { $inc: { balance: winMultiplier > 0 ? winAmount - bet : -bet } }
            );

            const embed = new EmbedBuilder()
                .setColor(winMultiplier > 0 ? config.colors.success : config.colors.error)
                .setTitle('🎰 Игровые автоматы')
                .setDescription(`[ ${slots.join(' | ')} ]\n\n${result}`)
                .addFields(
                    { name: 'Ставка', value: `${bet} ${config.currency}`, inline: true },
                    { name: 'Выигрыш', value: `${winMultiplier > 0 ? winAmount : 0} ${config.currency}`, inline: true }
                )
                .setFooter({ text: `Игрок: ${interaction.user.username}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Произошла ошибка при игре в автоматы',
                ephemeral: true 
            });
        }
    },
};