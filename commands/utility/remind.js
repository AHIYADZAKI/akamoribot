const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Установить напоминание')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Время (например, 1h30m, 2d, 30m)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Сообщение напоминания')
                .setRequired(true)),
    async execute(interaction) {
        const timeStr = interaction.options.getString('time');
        const message = interaction.options.getString('message');

        // Парсим время (например, 1h30m, 2d, 30m)
        let ms = 0;
        const timeRegex = /(\d+)([dhm])/g;
        let match;
        
        while ((match = timeRegex.exec(timeStr)) !== null) {
            const value = parseInt(match[1]);
            const unit = match[2];
            
            if (unit === 'd') ms += value * 24 * 60 * 60 * 1000;
            else if (unit === 'h') ms += value * 60 * 60 * 1000;
            else if (unit === 'm') ms += value * 60 * 1000;
        }

        if (ms === 0) {
            return interaction.reply({ 
                content: '❌ Неверный формат времени. Используйте например: 1h30m, 2d, 30m', 
                ephemeral: true 
            });
        }

        if (ms > 30 * 24 * 60 * 60 * 1000) { // 30 дней максимум
            return interaction.reply({ 
                content: '❌ Максимальное время напоминания - 30 дней', 
                ephemeral: true 
            });
        }

        const endTime = Date.now() + ms;

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🔔 Напоминание установлено')
            .setDescription(`Я напомню вам:\n"${message}"`)
            .addFields(
                { name: 'Через', value: timeStr },
                { name: 'Напоминание придет', value: `<t:${Math.floor(endTime / 1000)}:R>` }
            )
            .setFooter({ text: `Для ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });

        setTimeout(async () => {
            const notifyEmbed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔔 Напоминание!')
                .setDescription(message)
                .setFooter({ text: `Напоминание было установлено ${timeStr} назад` });

            await interaction.user.send({ embeds: [notifyEmbed] }).catch(() => {
                interaction.followUp({ 
                    content: `${interaction.user}`, 
                    embeds: [notifyEmbed] 
                });
            });
        }, ms);
    },
};