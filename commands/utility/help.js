const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Показать список всех команд'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('📚 Список команд')
            .setDescription(`Префикс бота: \`/\`\nВерсия: ${config.version}`)
            .addFields(
                { name: '🔧 Утилиты', value: '`help`, `ping`, `serverinfo`, `userinfo`, `botinfo`, `avatar`, `banner`, `roles`, `poll`, `suggest`, `embed`, `translate`, `weather`, `calculator`, `timer`, `remind`, `covid`' },
                { name: '💰 Экономика', value: '`balance`, `daily`, `work`, `crime`, `pay`, `rob`, `deposit`, `withdraw`, `shop`, `buy`, `sell`, `inventory`, `leaderboard`, `slots`' },
                { name: '🛡️ Модерация', value: '`ban`, `unban`, `kick`, `mute`, `unmute`, `warn`, `warnings`, `clearwarns`, `purge`, `timeout`' },
                { name: '🎵 Музыка', value: '`play`, `skip`, `stop`, `queue`, `pause`, `resume`, `volume`, `nowplaying`, `shuffle`, `loop`, `lyrics`, `search`' },
                { name: '🎭 Развлечения', value: '`meme`, `joke`, `cat`, `dog`, `coinflip`, `rps`, `8ball`, `rate`, `howgay`, `ship`, `fact`, `trivia`, `wouldyourather`, `neverhaveiever`, `truthordare`' }
            )
            .setFooter({ text: 'Напишите /[команда] для получения информации' });

        await interaction.reply({ embeds: [embed] });
    },
};