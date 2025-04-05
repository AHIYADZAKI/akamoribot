const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Установить таймер')
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Количество минут')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Причина таймера')
                .setRequired(false)),
    async execute(interaction) {
        const minutes = interaction.options.getInteger('minutes');
        const reason = interaction.options.getString('reason') || 'Таймер завершен!';

        if (minutes < 1 || minutes > 1440) {
            return interaction.reply({ 
                content: '❌ Укажите время от 1 до 1440 минут (24 часа)', 
                ephemeral: true 
            });
        }

        const ms = minutes * 60 * 1000;
        const endTime = Date.now() + ms;

        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('⏱ Таймер установлен')
            .setDescription(`Таймер на ${minutes} минут\nПричина: ${reason}`)
            .addFields(
                { name: 'Завершится', value: `<t:${Math.floor(endTime / 1000)}:R>` }
            )
            .setFooter({ text: `Установлен ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });

        setTimeout(async () => {
            const notifyEmbed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('🔔 Таймер завершен!')
                .setDescription(reason)
                .setFooter({ text: `Таймер был установлен на ${minutes} минут` });

            await interaction.followUp({ 
                content: `${interaction.user}`, 
                embeds: [notifyEmbed] 
            });
        }, ms);
    },
};