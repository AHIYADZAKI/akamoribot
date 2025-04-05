const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Показать погоду в указанном городе')
        .addStringOption(option =>
            option.setName('city')
                .setDescription('Название города')
                .setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('city');
        const apiKey = config.weatherApiKey;

        if (!apiKey) {
            return interaction.reply({ 
                content: '❌ API ключ для погоды не настроен', 
                ephemeral: true 
            });
        }

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`
            );

            const weather = response.data;
            const temp = Math.round(weather.main.temp);
            const feelsLike = Math.round(weather.main.feels_like);
            const windSpeed = Math.round(weather.wind.speed * 3.6); // Переводим м/с в км/ч

            const embed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle(`🌤️ Погода в ${weather.name}, ${weather.sys.country}`)
                .setDescription(`${weather.weather[0].description}`)
                .addFields(
                    { name: '🌡️ Температура', value: `${temp}°C (ощущается как ${feelsLike}°C)`, inline: true },
                    { name: '💧 Влажность', value: `${weather.main.humidity}%`, inline: true },
                    { name: '🌬️ Ветер', value: `${windSpeed} км/ч`, inline: true },
                    { name: '☁️ Облачность', value: `${weather.clouds.all}%`, inline: true },
                    { name: '📊 Давление', value: `${weather.main.pressure} hPa`, inline: true },
                    { name: '👀 Видимость', value: `${weather.visibility / 1000} км`, inline: true }
                )
                .setFooter({ text: 'Данные предоставлены OpenWeatherMap' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: '❌ Не удалось получить данные о погоде. Проверьте название города.', 
                ephemeral: true 
            });
        }
    },
};