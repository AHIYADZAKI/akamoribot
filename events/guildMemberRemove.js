const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const GoodbyeChannel = require('../systems/database/models/GoodbyeChannel');
const modLog = require('../systems/logging/modLog');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            // Прощальное сообщение
            const goodbyeData = await GoodbyeChannel.findOne({ guildId: member.guild.id });
            if (goodbyeData) {
                const channel = member.guild.channels.cache.get(goodbyeData.channelId);
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setColor(config.colors.error)
                        .setTitle(`Прощай, ${member.user.username}!`)
                        .setDescription(goodbyeData.message.replace('{user}', member.user))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setFooter({ text: `Участников: ${member.guild.memberCount}` })
                        .setTimestamp();

                    await channel.send({ embeds: [embed] });
                }
            }

            // Логирование
            await modLog(
                member.guild,
                new EmbedBuilder()
                    .setColor(config.colors.error)
                    .setTitle('Участник вышел')
                    .setDescription(`${member.user.tag} (${member.user.id})`)
                    .addFields(
                        { name: 'Присоединился', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` },
                        { name: 'Участников', value: `${member.guild.memberCount}` }
                    )
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp()
            );
        } catch (error) {
            console.error('Ошибка в guildMemberRemove:', error);
        }
    }
};