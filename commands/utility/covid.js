const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('covid')
        .setDescription('Показать статистику COVID-19')
        .addStringOption(option =>
            option.setName('country')
                .setDescription('Страна для проверки (например, Russia, USA)')
                .setRequired(false)),
    async execute(interaction) {
        const country = interaction.options.getString('country') || 'all';

        try {
            const response = await axios.get(
                `https://disease.sh/v3/covid-19/${country === 'all' ? 'all' : `countries/${country}`}`
            );

            const data = response.data;
            const lastUpdated = new Date(data.updated).toLocaleString();

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`🦠 Статистика COVID-19 ${country === 'all' ? 'в мире' : `в ${data.country}`}`)
                .addFields(
                    { name: '😷 Всего случаев', value: data.cases.toLocaleString(), inline: true },
                    { name: '💀 Смертей', value: data.deaths.toLocaleString(), inline: true },
                    { name: '💪 Выздоровело', value: data.recovered.toLocaleString(), inline: true },
                    { name: '🏥 Активные случаи', value: data.active.toLocaleString(), inline: true },
                    { name: '📈 Случаев сегодня', value: data.todayCases.toLocaleString(), inline: true },
                    { name: '⚰️ Смертей сегодня', value: data.todayDeaths.toLocaleString(), inline: true },
                    { name: '💉 Сделано тестов', value: data.tests?.toLocaleString() || 'Нет данных', inline: true },
                    { name: '🛡️ Вакцинировано', value: data.peopleVaccinated?.toLocaleString() || 'Нет данных', inline: true }
                )
                .setFooter({ text: `Обновлено: ${lastUpdated}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Не удалось получить данные. Проверьте название страны или попробуйте позже.', 
                ephemeral: true 
            });
        }
    },
};