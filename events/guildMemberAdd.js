const { EmbedBuilder } = require('discord.js');
const config = require('../../config');
const WelcomeChannel = require('../../systems/database/models/WelcomeChannel');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            const welcomeData = await WelcomeChannel.findOne({ guildId: member.guild.id });
            if (!welcomeData) return;

            const channel = member.guild.channels.cache.get(welcomeData.channelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle(`Добро пожаловать, ${member.user.username}!`)
                .setDescription(welcomeData.message.replace('{user}', member.user))
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: `ID: ${member.user.id}` })
                .setTimestamp();

            await channel.send({ embeds: [embed] });

            // Выдача роли при входе
            if (welcomeData.roleId) {
                const role = member.guild.roles.cache.get(welcomeData.roleId);
                if (role) await member.roles.add(role);
            }
        } catch (error) {
            console.error('Ошибка в guildMemberAdd:', error);
        }
    }
};